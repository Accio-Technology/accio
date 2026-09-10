import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

interface TurnstileVerification {
  success: boolean;
  errorCodes: string[] | undefined;
  hostname: string | undefined;
}

async function verifyTurnstile(token: string, secretKey: string, ip: string | null): Promise<TurnstileVerification> {
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (ip) {
    formData.append('remoteip', ip);
  }

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const json = await result.json();
  return {
    success: json.success === true,
    errorCodes: json['error-codes'],
    hostname: json.hostname,
  };
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
  const { env } = locals.runtime;

  let body: ContactFormData;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, subject, message, turnstileToken } = body;

  if (!name || !email || !subject || !message || !turnstileToken) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const verification = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  console.log('[contact] Turnstile verification result', {
    success: verification.success,
    errorCodes: verification.errorCodes,
    hostname: verification.hostname,
    secretPresent: Boolean(env.TURNSTILE_SECRET_KEY),
    siteKeyPresent: Boolean(env.TURNSTILE_SITE_KEY),
  });
  if (!verification.success) {
    return new Response(JSON.stringify({ error: 'Verification failed. Please try again.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Accio Website <joseph@acciotechnology.com>',
      to: ['joseph@acciotechnology.com'],
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
    console.log('[contact] Resend email send failed', {
      status: emailRes.status,
      statusText: emailRes.statusText,
      resendApiKeyPresent: Boolean(env.RESEND_API_KEY),
    });
    return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('[contact] Resend email sent successfully');
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
