export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  console.log('API key present:', !!apiKey);
  console.log('Request body type:', body?.type);

  if (!apiKey) return res.status(500).json({ error: 'Missing RESEND_API_KEY' });

  let subject, html;

  if (body.type === 'demo') {
    subject = `New Demo Request — ${body.name || body.email}`;
    html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0a1f4e;margin-bottom:8px;">New Demo Request</h2>
        <p style="color:#666;margin-top:0;">Someone requested a demo via the Dealflow Scout website.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;width:140px;">Name</td>
            <td style="padding:12px 0;color:#333;">${body.name || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Email</td>
            <td style="padding:12px 0;color:#333;">${body.email}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Firm</td>
            <td style="padding:12px 0;color:#333;">${body.firm || '—'}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Message</td>
            <td style="padding:12px 0;color:#333;">${body.message || '—'}</td>
          </tr>
        </table>
      </div>
    `;
  } else if (body.type === 'founder') {
    subject = `New Startup Submission — ${body.company || 'Unknown'}`;
    html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0a1f4e;margin-bottom:8px;">New Startup Submission</h2>
        <p style="color:#666;margin-top:0;">A founder submitted their startup via the Dealflow Scout website.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;width:160px;">Company</td>
            <td style="padding:12px 0;color:#333;">${body.company || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Website</td>
            <td style="padding:12px 0;color:#333;">${body.website || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Description</td>
            <td style="padding:12px 0;color:#333;">${body.description || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Stage</td>
            <td style="padding:12px 0;color:#333;">${body.stage || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Sector</td>
            <td style="padding:12px 0;color:#333;">${body.sector || '—'}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-weight:600;color:#0a1f4e;">Founder Email</td>
            <td style="padding:12px 0;color:#333;">${body.email || '—'}</td>
          </tr>
        </table>
      </div>
    `;
  } else {
    return res.status(400).json({ error: 'Unknown form type' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dealflow Scout <onboarding@resend.dev>',
        to: ['dealflowscout@gmail.com'],
        subject,
        html,
      }),
    });

    const data = await response.json();
    console.log('Resend response status:', response.status);
    console.log('Resend response body:', JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.message || data.name || 'Resend rejected the request' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log('Fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
