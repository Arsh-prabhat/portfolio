# Contact form deployment

The contact form posts to `/api/contact`, a dependency-free Vercel Node.js function. It sends mail through the Resend REST API to `prabhatarsh1974@gmail.com`. The frontend reports success only when Resend accepts the message.

## Configure delivery

1. Deploy this static site to Vercel so the `api/contact.js` function is available at the same origin.
2. Create a Resend account and verify a domain you control for sending mail.
3. Add these server-side Vercel environment variables for the deployment environments you use:
   - `RESEND_API_KEY`: a Resend API key with permission to send email.
   - `CONTACT_FROM_EMAIL`: a sender on your verified domain, for example `Arsh Prabhat <hello@example.com>`.
4. Redeploy after setting the variables.

The recipient is fixed in the endpoint. Do not put the API key in frontend code or commit it to the repository. Without these environment variables, the endpoint returns a configuration error and the form tells the visitor to email you directly. For local testing, run the site through Vercel's local development environment and provide the same variables in an untracked local environment file.

The endpoint validates fields server-side, checks same-origin requests, ignores submissions that fill the honeypot, limits each IP to five attempts per hour per running function instance, and caps field lengths. The in-memory rate limit is a basic abuse barrier; a high-traffic deployment should use shared persistent rate limiting.
