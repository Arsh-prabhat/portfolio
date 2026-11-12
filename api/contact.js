const RECIPIENT = 'prabhatarsh1974@gmail.com';
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;
const requestsByIp = new Map();

function sendJson(res, status, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(payload);
}

function cleanText(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, maxLength)
    : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function takeRateLimit(ip, now = Date.now()) {
  const recent = (requestsByIp.get(ip) || []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  requestsByIp.set(ip, recent);
  if (requestsByIp.size > 1000) {
    for (const [key, timestamps] of requestsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_WINDOW_MS)) requestsByIp.delete(key);
    }
  }
  return true;
}

module.exports = async function contactHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, error: 'Use POST to send a message.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) return sendJson(res, 403, { ok: false, error: 'This request is not allowed.' });
    } catch {
      return sendJson(res, 403, { ok: false, error: 'This request is not allowed.' });
    }
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 12_000) return sendJson(res, 413, { ok: false, error: 'Your message is too long.' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return sendJson(res, 400, { ok: false, error: 'Please check the form and try again.' });

  // Silently accept bot submissions that filled the off-screen honeypot.
  if (cleanText(body.website, 200)) return sendJson(res, 202, { ok: true });

  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = req.ip || (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') || req.socket?.remoteAddress || 'unknown';
  if (!takeRateLimit(ip)) return sendJson(res, 429, { ok: false, error: 'Too many messages were sent from this connection. Please try again later.' });

  const name = cleanText(body.name, 100).replace(/\s+/g, ' ');
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 40);
  const message = cleanText(body.message, 5000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^[+()\d\s.-]{5,40}$/;

  if (!name || !emailPattern.test(email) || !message || (phone && !phonePattern.test(phone))) {
    return sendJson(res, 400, { ok: false, error: 'Please check your name, email, phone, and message.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return sendJson(res, 503, { ok: false, error: 'Message sending is not configured yet. Please email me directly.' });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : 'Not provided';
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
        html: `<h2>Portfolio contact message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
      }),
      signal: controller.signal,
    });

    if (!providerResponse.ok) {
      return sendJson(res, 502, { ok: false, error: 'The email service could not accept your message. Please try again or email me directly.' });
    }
    return sendJson(res, 200, { ok: true });
  } catch {
    return sendJson(res, 502, { ok: false, error: 'The email service is temporarily unavailable. Please try again or email me directly.' });
  } finally {
    clearTimeout(timeout);
  }
};
