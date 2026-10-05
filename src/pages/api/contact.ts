import type { APIRoute } from 'astro';
import { site } from '../../config/site';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  turnstileToken: string;
}

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function verifyTurnstile(token: string, secretKey: string, ip: string | null): Promise<boolean> {
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (ip) {
    formData.append('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const POST: APIRoute = async ({ request, locals }) => {
  /*
    The old guard was a shared secret sent as an `x-contact: accio` header. Any
    script could read that value from the page bundle, so it stopped being a
    defense. Browsers always attach Origin to cross-site POSTs, so comparing it
    against the incoming URL is a real same-origin check with no secret to leak.
  */
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'Invalid request origin' }, 403);
  }

  const { env } = locals.runtime;

  let body: ContactFormData;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { name, email, subject, message, turnstileToken } = body;
  // Honeypot: a real browser submits this hidden field, empty. Treat a missing
  // field as empty too, so only an actual value counts as a bot.
  if ((body.company ?? '') !== '') {
    return json({ error: 'Invalid request' }, 400);
  }

  if (!name || !email || !subject || !message || !turnstileToken) {
    return json({ error: 'All fields are required' }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }

  // Turnstile stays mandatory here: this endpoint is the site's only bot defense.
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ error: 'Verification is not configured' }, 500);
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const turnstileValid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileValid) {
    return json({ error: 'Verification failed. Please try again.' }, 403);
  }

  const destination = site.contact?.email;
  if (!destination) {
    return json({ error: 'Contact form is not configured' }, 500);
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${site.name} Website <${destination}>`,
      to: [destination],
      reply_to: email,
      subject: `Contact: ${subject}`,
      html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0B192C; border-bottom: 2px solid #0066FF; padding-bottom: 10px;">New Contact Form Submission</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                        <tr>
                            <td style="padding: 8px 0; color: #475569; font-weight: 600; width: 120px;">Name</td>
                            <td style="padding: 8px 0; color: #0F172A;">${escapeHtml(name)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #475569; font-weight: 600;">Email</td>
                            <td style="padding: 8px 0; color: #0F172A;"><a href="mailto:${escapeHtml(email)}" style="color: #0066FF;">${escapeHtml(email)}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #475569; font-weight: 600;">Subject</td>
                            <td style="padding: 8px 0; color: #0F172A;">${escapeHtml(subject)}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; padding: 16px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #0066FF;">
                        <p style="color: #475569; font-weight: 600; margin: 0 0 8px 0;">Message</p>
                        <p style="color: #0F172A; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
                    </div>
                </div>
            `,
    }),
  });

  if (!emailRes.ok) {
    return json({ error: 'Failed to send message. Please try again later.' }, 500);
  }

  return json({ success: true }, 200);
};
