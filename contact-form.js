(() => {
  const opener = document.querySelector('[data-contact-open]');
  const dialog = document.querySelector('.contact-dialog');
  const form = dialog?.querySelector('.contact-form');
  const closeButton = dialog?.querySelector('[data-contact-close]');
  const status = dialog?.querySelector('.contact-form__status');
  const submitButton = dialog?.querySelector('.contact-form__submit');
  const cursor = document.querySelector('.custom-cursor');
  const cursorParent = cursor?.parentNode;
  const cursorNextSibling = cursor?.nextSibling;
  if (!opener || !dialog || !form || !closeButton || !status || !submitButton) return;

  const fields = ['name', 'email', 'phone', 'message'].map((name) => form.elements.namedItem(name));
  const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const setCursorPosition = (x, y, relativeToDialog = false) => {
    if (!cursor) return;
    if (relativeToDialog) {
      const rect = dialog.getBoundingClientRect();
      const style = window.getComputedStyle(dialog);
      x -= rect.left + Number.parseFloat(style.borderLeftWidth || '0');
      y -= rect.top + Number.parseFloat(style.borderTopWidth || '0');
    }
    cursor.style.setProperty('--cursor-x', `${x}px`);
    cursor.style.setProperty('--cursor-y', `${y}px`);
  };

  const restoreCursor = () => {
    if (!cursor || cursor.parentNode !== dialog || !cursorParent) return;
    if (cursorNextSibling?.parentNode === cursorParent) cursorParent.insertBefore(cursor, cursorNextSibling);
    else cursorParent.append(cursor);
    setCursorPosition(lastPointer.x, lastPointer.y);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastPointer = { x: event.clientX, y: event.clientY };
    if (dialog.open && cursor?.parentNode === dialog) setCursorPosition(event.clientX, event.clientY, true);
  }, { passive: true });

  const showError = (field, message = '') => {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!message) field.removeAttribute('aria-invalid');
    if (error) error.textContent = message;
  };

  const validate = () => {
    let firstInvalid = null;
    for (const field of fields) {
      const value = field.value.trim();
      let message = '';
      if (field.name === 'name' && !value) message = 'Please enter your name.';
      if (field.name === 'email') {
        if (!value) message = 'Please enter your email address.';
        else if (!field.validity.valid) message = 'Enter a valid email address.';
      }
      if (field.name === 'phone' && value && !/^[+()\d\s.-]{5,40}$/.test(value)) message = 'Enter a valid phone number or leave this field empty.';
      if (field.name === 'message' && !value) message = 'Please add a message.';
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  opener.addEventListener('click', (event) => {
    status.textContent = '';
    status.removeAttribute('data-state');
    dialog.showModal();
    document.body.classList.add('has-contact-dialog');
    if (cursor && supportsCustomCursor) {
      dialog.append(cursor);
      document.documentElement.classList.add('has-custom-cursor');
      cursor.classList.remove('is-hidden');
      const x = event.detail ? event.clientX : lastPointer.x;
      const y = event.detail ? event.clientY : lastPointer.y;
      lastPointer = { x, y };
      setCursorPosition(x, y, true);
    }
    window.requestAnimationFrame(() => form.elements.namedItem('name').focus());
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-contact-dialog');
    restoreCursor();
    opener.focus({ preventScroll: true });
  });
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (!field.name || !['name', 'email', 'phone', 'message'].includes(field.name)) return;
    showError(field);
    if (status.dataset.state === 'error') {
      status.textContent = '';
      status.removeAttribute('data-state');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    status.dataset.state = 'sending';
    status.textContent = 'Sending your message…';
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = '…';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'Your message could not be sent right now. Please try again or email me directly.');
      form.reset();
      fields.forEach((field) => showError(field));
      status.dataset.state = 'success';
      status.textContent = 'Thanks, your message has been sent. I’ll be in touch soon.';
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.message || 'Your message could not be sent right now. Please try again or email me directly.';
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = '↗';
    }
  });
})();
