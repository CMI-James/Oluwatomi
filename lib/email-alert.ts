type VisitorLoadEmailInput = {
  occurredAt: string;
  ip: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  path: string | null;
  url: string | null;
  visitorName: string | null;
};

const DEFAULT_TO_EMAIL = 'chibuikemichaelilonze@gmail.com';
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

export const sendVisitorLoadEmail = async (input: VisitorLoadEmailInput): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const toEmail = process.env.ALERT_EMAIL_TO?.trim() || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.ALERT_EMAIL_FROM?.trim() || DEFAULT_FROM_EMAIL;

  const subject = 'Website load detected';
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>New website load</h2>
      <p><strong>Time:</strong> ${input.occurredAt}</p>
      <p><strong>Name:</strong> ${input.visitorName || '-'}</p>
      <p><strong>IP:</strong> ${input.ip || '-'}</p>
      <p><strong>Device:</strong> ${input.deviceType || '-'} / ${input.os || '-'} / ${input.browser || '-'}</p>
      <p><strong>Path:</strong> ${input.path || '-'}</p>
      <p><strong>URL:</strong> ${input.url || '-'}</p>
    </div>
  `.trim();

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
    }),
    cache: 'no-store',
  });
};

