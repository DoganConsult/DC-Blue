const MSGRAPH_TENANT_ID = process.env.MSGRAPH_TENANT_ID || '';
const MSGRAPH_CLIENT_ID = process.env.MSGRAPH_CLIENT_ID || '';
const MSGRAPH_CLIENT_SECRET = process.env.MSGRAPH_CLIENT_SECRET || '';
const MSGRAPH_SENDER = process.env.MSGRAPH_SENDER || process.env.FROM_EMAIL || 'info@doganconsult.com';

let cachedToken = null;
let tokenExpiry = 0;

class EmailService {
  constructor() {
    if (MSGRAPH_TENANT_ID && MSGRAPH_CLIENT_ID && MSGRAPH_CLIENT_SECRET) {
      console.log('Email service ready (Microsoft Graph API)');
    } else {
      console.warn('Email service: Graph credentials not configured');
    }
  }

  async getToken() {
    if (cachedToken && Date.now() < tokenExpiry - 60000) return cachedToken;
    if (!MSGRAPH_TENANT_ID || !MSGRAPH_CLIENT_ID || !MSGRAPH_CLIENT_SECRET) return null;

    const body = new URLSearchParams({
      client_id: MSGRAPH_CLIENT_ID,
      client_secret: MSGRAPH_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    });

    const res = await fetch(
      `https://login.microsoftonline.com/${MSGRAPH_TENANT_ID}/oauth2/v2.0/token`,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Graph token error: ${err}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return cachedToken;
  }

  async sendMail(to, subject, html, text) {
    const token = await this.getToken();
    if (!token) throw new Error('No Graph API credentials configured');

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MSGRAPH_SENDER)}/sendMail`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            subject,
            body: { contentType: 'HTML', content: html },
            toRecipients: [{ emailAddress: { address: to } }],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Graph sendMail ${res.status}: ${err}`);
    }

    return { success: true, messageId: `graph-${Date.now()}`, to };
  }

  async verifyConnection() {
    try {
      await this.getToken();
      return true;
    } catch {
      return false;
    }
  }

  async sendWelcomeEmail(to, name) {
    const html = `
      <!DOCTYPE html><html><body>
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Dogan Consult</h2>
        <p>Hello ${name || 'Valued Partner'},</p>
        <p>Welcome to the Dogan Consult ICT Platform. Your account has been created.</p>
        <ul><li>Submit inquiries for ICT services</li><li>Track your project status</li><li>Access the partner portal</li></ul>
        <p style="text-align:center;"><a href="https://doganconsult.com" style="display:inline-block;background:#0EA5E9;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600;">Access Platform</a></p>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.5);">Dogan Consult — ICT Engineering Services | KSA</p>
      </div></body></html>`;
    try {
      return await this.sendMail(to, 'Welcome to Dogan Consult ICT Platform', html);
    } catch (e) {
      console.error('Failed to send welcome email:', e.message);
      return { success: false, error: e.message };
    }
  }

  async sendLeadNotification(leadData) {
    const html = `
      <!DOCTYPE html><html><body>
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h3 style="color:#006C35;">New Lead Received</h3>
        <div style="background:#f9f9f9;padding:20px;border-left:4px solid #0EA5E9;">
          <p><strong>Company:</strong> ${leadData.company_name || 'N/A'}</p>
          <p><strong>Contact:</strong> ${leadData.contact_name || 'N/A'} (${leadData.contact_email || 'N/A'})</p>
          <p><strong>Phone:</strong> ${leadData.contact_phone || 'N/A'}</p>
          <p><strong>Service:</strong> ${leadData.service_interest || 'N/A'}</p>
          <p><strong>Budget:</strong> ${leadData.budget_range || 'N/A'}</p>
          <p><strong>Message:</strong> ${leadData.message || 'N/A'}</p>
        </div>
        <p style="text-align:center;margin-top:20px;"><a href="https://doganconsult.com/admin" style="display:inline-block;background:#0EA5E9;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">View in Admin Portal</a></p>
      </div></body></html>`;
    try {
      return await this.sendMail('doganlap@gmail.com', `New Lead: ${leadData.company_name || 'Unknown'}`, html);
    } catch (e) {
      console.error('Failed to send lead notification:', e.message);
      return { success: false, error: e.message };
    }
  }

  async sendTestEmail(to) {
    const html = `
      <!DOCTYPE html><html><body>
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Dogan Consult — Email Test</h2>
        <p>This is a test email confirming the email system is operational.</p>
        <h3 style="color:#E3B76B;">Email Service Details:</h3>
        <ul>
          <li>Provider: Microsoft Graph API (OAuth2)</li>
          <li>Sender: ${MSGRAPH_SENDER}</li>
          <li>Timestamp: ${new Date().toISOString()}</li>
        </ul>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.5);">Dogan Consult — ICT Engineering Services<br/>www.doganconsult.com</p>
      </div></body></html>`;
    try {
      return await this.sendMail(to || 'doganlap@gmail.com', 'Test Email — Dogan Consult Platform', html);
    } catch (e) {
      console.error('Failed to send test email:', e.message);
      return { success: false, error: e.message };
    }
  }

  async sendCommissionNotification(partnerEmail, commissionData) {
    const html = `
      <!DOCTYPE html><html><body>
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Commission Update</h2>
        <p style="text-align:center;font-size:32px;font-weight:bold;color:#10B981;">SAR ${commissionData.amount || '0.00'}</p>
        <p style="text-align:center;">Commission ${commissionData.status || 'Pending'}</p>
        <p>Lead: #${commissionData.leadId || 'N/A'}</p>
        <p>Log in to your partner portal to view details.</p>
      </div></body></html>`;
    try {
      return await this.sendMail(partnerEmail, 'Commission Update — Dogan Consult Partner Program', html);
    } catch (e) {
      console.error('Failed to send commission notification:', e.message);
      return { success: false, error: e.message };
    }
  }
}

const emailService = new EmailService();

export default emailService;
export { EmailService };
