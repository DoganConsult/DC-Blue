const MSGRAPH_TENANT_ID = process.env.MSGRAPH_TENANT_ID || '';
const MSGRAPH_CLIENT_ID = process.env.MSGRAPH_CLIENT_ID || '';
const MSGRAPH_CLIENT_SECRET = process.env.MSGRAPH_CLIENT_SECRET || '';
const MSGRAPH_SENDER = process.env.MSGRAPH_SENDER || process.env.FROM_EMAIL || 'info@doganconsult.com';
const MSGRAPH_ADMIN_EMAIL = process.env.MSGRAPH_ADMIN_EMAIL || 'ahmet.dogan@doganconsult.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@doganconsult.com';
const FROM_NAME = process.env.FROM_NAME || 'Dogan Consult';

let cachedToken = null;
let tokenExpiry = 0;

async function getGraphToken() {
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
    console.error('Graph token error:', err);
    return null;
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

async function sendViaGraph(recipientEmail, subject, html) {
  const token = await getGraphToken();
  if (!token) return false;

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MSGRAPH_SENDER)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: html },
          toRecipients: [{ emailAddress: { address: recipientEmail } }],
        },
        saveToSentItems: true,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph sendMail ${res.status}: ${err}`);
  }
  return true;
}

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

export async function readAdminInbox(folder = 'inbox', top = 20, skip = 0, filter = '') {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  let url = `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/mailFolders/${folder}/messages?$top=${top}&$skip=${skip}&$orderby=receivedDateTime+desc&$select=id,subject,bodyPreview,from,toRecipients,receivedDateTime,isRead,hasAttachments,importance,conversationId`;
  if (filter) url += `&$filter=${encodeURIComponent(filter)}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Graph readInbox ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { ok: true, messages: data.value || [], count: data['@odata.count'] };
}

export async function readAdminMessage(messageId) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/messages/${messageId}?$select=id,subject,body,bodyPreview,from,toRecipients,ccRecipients,receivedDateTime,sentDateTime,isRead,hasAttachments,importance,conversationId`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Graph readMessage ${res.status}: ${await res.text()}`);
  return { ok: true, message: await res.json() };
}

export async function markAdminMessageRead(messageId, isRead = true) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/messages/${messageId}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    }
  );
  if (!res.ok) throw new Error(`Graph markRead ${res.status}: ${await res.text()}`);
  return { ok: true };
}

export async function replyAdminMessage(messageId, htmlBody) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/messages/${messageId}/reply`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: htmlBody }),
    }
  );
  if (!res.ok) throw new Error(`Graph reply ${res.status}: ${await res.text()}`);
  return { ok: true };
}

export async function sendAsAdmin(recipientEmail, subject, html) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: html },
          toRecipients: [{ emailAddress: { address: recipientEmail } }],
        },
        saveToSentItems: true,
      }),
    }
  );
  if (!res.ok) throw new Error(`Graph sendAsAdmin ${res.status}: ${await res.text()}`);
  return { ok: true };
}

export async function getAdminMailFolders() {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(MSGRAPH_ADMIN_EMAIL)}/mailFolders?$top=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Graph folders ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { ok: true, folders: data.value || [] };
}

export async function readMailboxInbox(account, folder = 'inbox', top = 20, skip = 0, filter = '') {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  let url = `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/mailFolders/${folder}/messages?$top=${top}&$skip=${skip}&$orderby=receivedDateTime+desc&$select=id,subject,bodyPreview,from,toRecipients,receivedDateTime,isRead,hasAttachments,importance,conversationId`;
  if (filter) url += `&$filter=${encodeURIComponent(filter)}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Graph readInbox [${userEmail}] ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { ok: true, account: userEmail, messages: data.value || [], count: data['@odata.count'] };
}

export async function readMailboxMessage(account, messageId) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/messages/${messageId}?$select=id,subject,body,bodyPreview,from,toRecipients,ccRecipients,receivedDateTime,sentDateTime,isRead,hasAttachments,importance,conversationId`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Graph readMessage [${userEmail}] ${res.status}: ${await res.text()}`);
  return { ok: true, account: userEmail, message: await res.json() };
}

export async function markMailboxMessageRead(account, messageId, isRead = true) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/messages/${messageId}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    }
  );
  if (!res.ok) throw new Error(`Graph markRead [${userEmail}] ${res.status}: ${await res.text()}`);
  return { ok: true };
}

export async function replyMailboxMessage(account, messageId, htmlBody) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/messages/${messageId}/reply`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: htmlBody }),
    }
  );
  if (!res.ok) throw new Error(`Graph reply [${userEmail}] ${res.status}: ${await res.text()}`);
  return { ok: true };
}

export async function getMailboxFolders(account) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/mailFolders?$top=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Graph folders [${userEmail}] ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { ok: true, account: userEmail, folders: data.value || [] };
}

export async function sendFromMailbox(account, recipientEmail, subject, html) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: html },
          toRecipients: [{ emailAddress: { address: recipientEmail } }],
        },
        saveToSentItems: true,
      }),
    }
  );
  if (!res.ok) throw new Error(`Graph sendMail [${userEmail}] ${res.status}: ${await res.text()}`);
  return { ok: true, account: userEmail };
}

export async function getUnreadCount(account) {
  const token = await getGraphToken();
  if (!token) return { ok: false, error: 'No Graph credentials' };

  const userEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(userEmail)}/mailFolders/inbox?$select=unreadItemCount,totalItemCount`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Graph unread [${userEmail}] ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { ok: true, account: userEmail, unreadItemCount: data.unreadItemCount, totalItemCount: data.totalItemCount };
}

export { MSGRAPH_ADMIN_EMAIL, MSGRAPH_SENDER };

/* ── IBM Carbon Enterprise Email Wrapper ─────────────────────── */
function carbonWrap(title, bodyHtml, lang = 'en') {
  const isRtl = lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontFamily = isRtl
    ? "'IBM Plex Arabic', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    : "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const brandName = isRtl ? 'دوغان للاستشارات' : 'Dogan Consult';
  const tagline = isRtl ? 'خدمات هندسة تقنية المعلومات والاتصالات' : 'ICT Engineering Services';
  const siteUrl = 'https://www.doganconsult.com';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:${fontFamily};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#0A3C6B;padding:24px 32px;border-radius:8px 8px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">${brandName}</span></td>
              <td align="${isRtl ? 'left' : 'right'}"><span style="font-size:12px;color:rgba(255,255,255,0.7);">${tagline}</span></td>
            </tr>
          </table>
          <div style="height:3px;background:#E3B76B;margin-top:16px;border-radius:2px;"></div>
        </td></tr>
        <!-- Title Bar -->
        <tr><td style="background:#0A3C6B;padding:0 32px 20px;">
          <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.3;">${title}</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
          <div style="font-size:14px;line-height:1.7;color:#161616;">
            ${bodyHtml}
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#ffffff;padding:24px 32px;border-top:1px solid #e0e0e0;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;border-radius:0 0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td>
              <p style="margin:0 0 4px;font-size:12px;color:#525252;font-weight:600;">${brandName}</p>
              <p style="margin:0;font-size:11px;color:#8d8d8d;line-height:1.5;">
                ${isRtl ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}<br/>
                <a href="${siteUrl}" style="color:#0f62fe;text-decoration:none;">www.doganconsult.com</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function carbonBtn(href, label, color = '#0A3C6B') {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td>
    <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;padding:12px 28px;border-radius:4px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.3px;">${label}</a>
  </td></tr></table>`;
}

function carbonInfoRow(label, value, color) {
  const valStyle = color ? `color:${color};font-weight:600;` : 'color:#161616;';
  return `<tr><td style="padding:6px 0;font-size:13px;color:#525252;width:130px;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:13px;${valStyle}">${value}</td></tr>`;
}

function carbonCodeBlock(value) {
  return `<div style="background:#f4f4f4;border:1px solid #e0e0e0;border-left:3px solid #0A3C6B;padding:16px 20px;border-radius:2px;font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;font-size:13px;color:#161616;word-break:break-all;line-height:1.5;margin:16px 0;">${value}</div>`;
}

const TEMPLATES = {
  inquiry_confirmation: {
    subjectEn: (d) => `We received your request – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تم استلام طلبك – رقم #${d.ticket_number}`,
    bodyEn: (d) => carbonWrap('Request Received', `
      <p>Dear ${d.contact_name || 'Customer'},</p>
      <p>Thank you for your interest in <strong>${d.product_line || 'our services'}</strong>. We have received your inquiry and assigned it a reference number.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('Reference', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Service', d.product_line || 'General Inquiry')}
      </table>
      <p style="color:#525252;">A member of our team will be in touch within <strong style="color:#161616;">24 hours</strong>.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('تم استلام طلبك', `
      <p>عزيزي ${d.contact_name || 'العميل'},</p>
      <p>شكراً لاهتمامكم بخصوص <strong>${d.product_line || 'خدماتنا'}</strong>. تم استلام استفساركم وتخصيص رقم مرجعي له.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('رقم المرجع', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('الخدمة', d.product_line || 'استفسار عام')}
      </table>
      <p style="color:#525252;">سيتواصل معكم أحد أعضاء فريقنا خلال <strong style="color:#161616;">24 ساعة</strong>.</p>
    `, 'ar'),
  },
  internal_new_lead: {
    subjectEn: (d) => `New lead: ${d.company_name} — ${d.product_line || 'General'} [${d.ticket_number}]`,
    bodyEn: (d) => carbonWrap('New Lead Received', `
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Company', d.company_name)}
        ${carbonInfoRow('Contact', `${d.contact_name} (${d.contact_email})`)}
        ${carbonInfoRow('Service', d.product_line || '—')}
        ${carbonInfoRow('Score', d.score, d.score >= 70 ? '#198038' : d.score >= 40 ? '#f1c21b' : '#da1e28')}
        ${carbonInfoRow('Assigned to', d.assigned_to)}
      </table>
      ${carbonBtn(d.admin_url, 'View Lead in Dashboard')}
    `, 'en'),
  },
  partner_submitted: {
    subjectEn: (d) => `Lead submitted – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تم إرسال العميل – رقم #${d.ticket_number}`,
    bodyEn: (d) => carbonWrap('Lead Submitted', `
      <p>Your lead for <strong>${d.company_name}</strong> has been submitted successfully.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Company', d.company_name)}
      </table>
      <p style="color:#525252;">We will review and respond within <strong style="color:#161616;">2 business days</strong>.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('تم إرسال العميل', `
      <p>تم إرسال العميل المحتمل لشركة <strong>${d.company_name}</strong> بنجاح.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('رقم التذكرة', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('الشركة', d.company_name)}
      </table>
      <p style="color:#525252;">سنراجع ونرد خلال <strong style="color:#161616;">يومي عمل</strong>.</p>
    `, 'ar'),
  },
  partner_application_received: {
    subjectEn: () => 'Partner application received — Dogan Consult',
    subjectAr: () => 'تم استلام طلب الشراكة — دوغان للاستشارات',
    bodyEn: (d) => carbonWrap('Application Received', `
      <p>Hi ${d.contact_name || 'there'},</p>
      <p>We have received your partner application for <strong>${d.company_name || 'your company'}</strong>.</p>
      <div style="background:#f4f4f4;border-left:3px solid #0A3C6B;padding:16px 20px;margin:20px 0;border-radius:2px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#161616;">Next Steps</p>
        <ol style="margin:0;padding-left:20px;color:#525252;font-size:13px;line-height:1.8;">
          <li>Our team reviews your application</li>
          <li>Once approved, you receive your <strong>API Key</strong> and login credentials</li>
          <li>Access the Partner Portal to start submitting leads</li>
        </ol>
      </div>
      <p style="font-size:12px;color:#8d8d8d;">If you already registered before, you can request a login email to be resent.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('تم استلام الطلب', `
      <p>مرحباً ${d.contact_name || ''}،</p>
      <p>تم استلام طلب الشراكة الخاص بكم لشركة <strong>${d.company_name || ''}</strong>.</p>
      <div style="background:#f4f4f4;border-right:3px solid #0A3C6B;padding:16px 20px;margin:20px 0;border-radius:2px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#161616;">الخطوات التالية</p>
        <ol style="margin:0;padding-right:20px;color:#525252;font-size:13px;line-height:1.8;">
          <li>فريقنا يراجع طلبكم</li>
          <li>بعد الموافقة، ستتلقون <strong>مفتاح API</strong> وبيانات الدخول</li>
          <li>الدخول إلى بوابة الشركاء لبدء تقديم العملاء المحتملين</li>
        </ol>
      </div>
      <p style="font-size:12px;color:#8d8d8d;">إذا كنتم قد سجلتم سابقاً يمكنكم طلب إعادة إرسال رسالة الدخول.</p>
    `, 'ar'),
  },
  partner_portal_access: {
    subjectEn: () => 'Your Partner Portal access — Dogan Consult',
    subjectAr: () => 'بيانات دخول بوابة الشركاء — دوغان للاستشارات',
    bodyEn: (d) => carbonWrap('Partner Portal Access', `
      <p>Hi ${d.contact_name || 'Partner'},</p>
      <p>Your partner account for <strong>${d.company_name || 'your company'}</strong> has been activated.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('Portal URL', `<a href="${d.portal_url}" style="color:#0f62fe;text-decoration:none;">${d.portal_url}</a>`)}
      </table>
      <p style="font-size:13px;font-weight:600;color:#161616;margin-bottom:8px;">Your API Key</p>
      ${carbonCodeBlock(d.api_key)}
      <div style="background:#f4f4f4;border-left:3px solid #0A3C6B;padding:16px 20px;margin:20px 0;border-radius:2px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#161616;">Login Steps</p>
        <ol style="margin:0;padding-left:20px;color:#525252;font-size:13px;line-height:1.8;">
          <li>Open the Partner Portal link above</li>
          <li>Paste your API Key</li>
          <li>Click <strong>Access Dashboard</strong></li>
        </ol>
      </div>
      <p style="font-size:12px;color:#da1e28;">Keep this API key secure. Anyone with this key can access your partner dashboard.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('بيانات دخول بوابة الشركاء', `
      <p>مرحباً ${d.contact_name || ''}،</p>
      <p>تم تفعيل حساب الشريك لشركة <strong>${d.company_name || ''}</strong>.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('بوابة الشركاء', `<a href="${d.portal_url}" style="color:#0f62fe;text-decoration:none;">${d.portal_url}</a>`)}
      </table>
      <p style="font-size:13px;font-weight:600;color:#161616;margin-bottom:8px;">مفتاح API الخاص بكم</p>
      ${carbonCodeBlock(d.api_key)}
      <div style="background:#f4f4f4;border-right:3px solid #0A3C6B;padding:16px 20px;margin:20px 0;border-radius:2px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#161616;">خطوات الدخول</p>
        <ol style="margin:0;padding-right:20px;color:#525252;font-size:13px;line-height:1.8;">
          <li>افتح رابط بوابة الشركاء أعلاه</li>
          <li>الصق مفتاح API</li>
          <li>اضغط <strong>الدخول</strong></li>
        </ol>
      </div>
      <p style="font-size:12px;color:#da1e28;">يرجى حفظ مفتاح API بأمان.</p>
    `, 'ar'),
  },
  partner_approved: {
    subjectEn: (d) => `Your lead has been approved – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تمت الموافقة على العميل – رقم #${d.ticket_number}`,
    bodyEn: (d) => carbonWrap('Lead Approved', `
      <div style="background:#defbe6;border-left:3px solid #198038;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#198038;font-weight:600;">Your lead has been approved</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Company', d.company_name)}
        ${carbonInfoRow('Status', 'Approved', '#198038')}
      </table>
      <p style="color:#525252;">The exclusivity window has started. We will keep you updated on progress.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('تمت الموافقة على العميل', `
      <div style="background:#defbe6;border-right:3px solid #198038;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#198038;font-weight:600;">تمت الموافقة على العميل المحتمل</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('رقم التذكرة', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('الشركة', d.company_name)}
        ${carbonInfoRow('الحالة', 'تمت الموافقة', '#198038')}
      </table>
      <p style="color:#525252;">بدأت فترة الحصرية. سنبقيكم على اطلاع بالتطورات.</p>
    `, 'ar'),
  },
  partner_rejected: {
    subjectEn: (d) => `Lead update – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تحديث العميل – رقم #${d.ticket_number}`,
    bodyEn: (d) => carbonWrap('Lead Not Approved', `
      <div style="background:#fff1f1;border-left:3px solid #da1e28;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#da1e28;font-weight:600;">Lead was not approved</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Company', d.company_name)}
        ${d.reason ? carbonInfoRow('Reason', d.reason) : ''}
      </table>
      <p style="color:#525252;">If you have questions, please contact our team.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('لم تتم الموافقة على العميل', `
      <div style="background:#fff1f1;border-right:3px solid #da1e28;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#da1e28;font-weight:600;">لم تتم الموافقة على العميل المحتمل</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('رقم التذكرة', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('الشركة', d.company_name)}
        ${d.reason ? carbonInfoRow('السبب', d.reason) : ''}
      </table>
      <p style="color:#525252;">إذا كانت لديكم أسئلة، يرجى التواصل مع فريقنا.</p>
    `, 'ar'),
  },
  stage_update: {
    subjectEn: (d) => `Opportunity update: ${d.company_name} moved to ${d.new_stage}`,
    subjectAr: (d) => `تحديث الفرصة: ${d.company_name} انتقلت إلى ${d.new_stage}`,
    bodyEn: (d) => carbonWrap('Stage Update', `
      <p>The opportunity for <strong>${d.company_name}</strong> has advanced to a new stage.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('Company', d.company_name)}
        ${carbonInfoRow('New Stage', d.new_stage, '#0f62fe')}
      </table>
    `, 'en'),
    bodyAr: (d) => carbonWrap('تحديث المرحلة', `
      <p>انتقلت فرصة <strong>${d.company_name}</strong> إلى مرحلة جديدة.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('رقم التذكرة', d.ticket_number, '#0A3C6B')}
        ${carbonInfoRow('الشركة', d.company_name)}
        ${carbonInfoRow('المرحلة الجديدة', d.new_stage, '#0f62fe')}
      </table>
    `, 'ar'),
  },
  commission_created: {
    subjectEn: (d) => `Commission eligible – ${d.company_name}`,
    subjectAr: (d) => `عمولة مستحقة – ${d.company_name}`,
    bodyEn: (d) => carbonWrap('Commission Notification', `
      <div style="background:#defbe6;border-left:3px solid #198038;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#198038;font-weight:600;">Deal closed — commission eligible</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('Company', d.company_name)}
        ${carbonInfoRow('Commission', `${d.amount} ${d.currency}`, '#198038')}
        ${carbonInfoRow('Status', 'Pending approval')}
      </table>
    `, 'en'),
    bodyAr: (d) => carbonWrap('إشعار عمولة', `
      <div style="background:#defbe6;border-right:3px solid #198038;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#198038;font-weight:600;">تم إغلاق الصفقة — العمولة مستحقة</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('الشركة', d.company_name)}
        ${carbonInfoRow('العمولة', `${d.amount} ${d.currency}`, '#198038')}
        ${carbonInfoRow('الحالة', 'بانتظار الموافقة')}
      </table>
    `, 'ar'),
  },
  sla_breach_warning: {
    subjectEn: (d) => `SLA Warning: Lead #${d.ticket_number} needs attention`,
    subjectAr: (d) => `تحذير SLA: العميل #${d.ticket_number} يحتاج اهتمام`,
    bodyEn: (d) => carbonWrap('SLA Breach Warning', `
      <div style="background:#fff1f1;border-left:3px solid #da1e28;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#da1e28;font-weight:600;">Immediate action required</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('Ticket', d.ticket_number, '#da1e28')}
        ${carbonInfoRow('Company', d.company_name)}
        ${carbonInfoRow('Status', d.status)}
        ${carbonInfoRow('Duration', `${d.hours} hours`, '#da1e28')}
        ${carbonInfoRow('Assigned to', d.assigned_to)}
      </table>
      ${carbonBtn(d.admin_url, 'Take Action', '#da1e28')}
    `, 'en'),
    bodyAr: (d) => carbonWrap('تحذير اتفاقية مستوى الخدمة', `
      <div style="background:#fff1f1;border-right:3px solid #da1e28;padding:16px 20px;border-radius:2px;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#da1e28;font-weight:600;">إجراء فوري مطلوب</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        ${carbonInfoRow('رقم التذكرة', d.ticket_number, '#da1e28')}
        ${carbonInfoRow('الشركة', d.company_name)}
        ${carbonInfoRow('الحالة', d.status)}
        ${carbonInfoRow('المدة', `${d.hours} ساعة`, '#da1e28')}
        ${carbonInfoRow('مسند إلى', d.assigned_to)}
      </table>
      ${carbonBtn(d.admin_url, 'اتخذ إجراء', '#da1e28')}
    `, 'ar'),
  },
  password_reset: {
    subjectEn: () => 'Password Reset — Dogan Consult',
    subjectAr: () => 'إعادة تعيين كلمة المرور — دوغان للاستشارات',
    bodyEn: (d) => carbonWrap('Password Reset', `
      <p>Hi ${d.contact_name || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to set a new one.</p>
      ${carbonBtn(d.reset_url, 'Reset Password', '#0f62fe')}
      <p style="font-size:12px;color:#8d8d8d;margin-top:24px;">This link expires in ${d.expires_minutes || 60} minutes.</p>
      <p style="font-size:12px;color:#8d8d8d;">If you didn't request this, you can safely ignore this email.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('إعادة تعيين كلمة المرور', `
      <p>مرحباً ${d.contact_name || ''},</p>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور. انقر الزر أدناه لتعيين كلمة مرور جديدة.</p>
      ${carbonBtn(d.reset_url, 'إعادة تعيين كلمة المرور', '#0f62fe')}
      <p style="font-size:12px;color:#8d8d8d;margin-top:24px;">ينتهي هذا الرابط خلال ${d.expires_minutes || 60} دقيقة.</p>
      <p style="font-size:12px;color:#8d8d8d;">إذا لم تطلب ذلك، يمكنك تجاهل هذا البريد.</p>
    `, 'ar'),
  },
  mfa_code: {
    subjectEn: () => 'Your verification code — Dogan Consult',
    subjectAr: () => 'رمز التحقق الخاص بك — دوغان للاستشارات',
    bodyEn: (d) => carbonWrap('Verification Code', `
      <p>Hi ${d.contact_name || 'there'},</p>
      <p>Your login verification code is:</p>
      <div style="text-align:center;margin:28px 0;">
        <span style="display:inline-block;background:#f4f4f4;border:2px solid #0A3C6B;padding:16px 36px;border-radius:4px;font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;font-size:32px;letter-spacing:8px;color:#0A3C6B;font-weight:700;">${d.code}</span>
      </div>
      <p style="font-size:12px;color:#8d8d8d;">This code expires in 10 minutes. Do not share it with anyone.</p>
      <p style="font-size:12px;color:#da1e28;">If you didn't request this, someone may be trying to access your account. Please change your password immediately.</p>
    `, 'en'),
    bodyAr: (d) => carbonWrap('رمز التحقق', `
      <p>مرحباً ${d.contact_name || ''},</p>
      <p>رمز التحقق لتسجيل الدخول:</p>
      <div style="text-align:center;margin:28px 0;">
        <span style="display:inline-block;background:#f4f4f4;border:2px solid #0A3C6B;padding:16px 36px;border-radius:4px;font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;font-size:32px;letter-spacing:8px;color:#0A3C6B;font-weight:700;">${d.code}</span>
      </div>
      <p style="font-size:12px;color:#8d8d8d;">ينتهي هذا الرمز خلال 10 دقائق. لا تشاركه مع أي شخص.</p>
      <p style="font-size:12px;color:#da1e28;">إذا لم تطلب ذلك، قد يحاول شخص ما الوصول لحسابك. يرجى تغيير كلمة المرور فوراً.</p>
    `, 'ar'),
  },
  welcome_registration: {
    subjectEn: () => 'Welcome to Dogan Consult',
    subjectAr: () => 'مرحباً بكم في دوغان للاستشارات',
    bodyEn: (d) => carbonWrap('Welcome', `
      <p>Hi ${d.contact_name || 'there'},</p>
      <p>Your account has been created successfully. You can now sign in and access your workspace.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('Account Type', d.category || 'Customer')}
        ${carbonInfoRow('Email', d.email)}
      </table>
      ${carbonBtn(d.login_url || 'https://www.doganconsult.com/login', 'Sign In to Your Workspace')}
    `, 'en'),
    bodyAr: (d) => carbonWrap('مرحباً بكم', `
      <p>مرحباً ${d.contact_name || ''},</p>
      <p>تم إنشاء حسابكم بنجاح. يمكنكم الآن تسجيل الدخول والوصول لمساحة العمل الخاصة بكم.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        ${carbonInfoRow('نوع الحساب', d.category || 'عميل')}
        ${carbonInfoRow('البريد الإلكتروني', d.email)}
      </table>
      ${carbonBtn(d.login_url || 'https://www.doganconsult.com/login', 'تسجيل الدخول لمساحة العمل')}
    `, 'ar'),
  },
};

export async function sendEmail(pool, template, data, recipientEmail, lang = 'en') {
  const t = TEMPLATES[template];
  if (!t) {
    console.warn(`Email template "${template}" not found`);
    return false;
  }

  const subject = lang === 'ar' && t.subjectAr ? t.subjectAr(data) : t.subjectEn(data);
  const html = lang === 'ar' && t.bodyAr ? t.bodyAr(data) : t.bodyEn(data);

  const hasGraph = !!(MSGRAPH_TENANT_ID && MSGRAPH_CLIENT_ID && MSGRAPH_CLIENT_SECRET);
  if (!hasGraph) {
    console.log(`[EMAIL-DRY] To: ${recipientEmail} | Subject: ${subject}`);
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO email_log (recipient, template, subject, status, entity_type, entity_id)
           VALUES ($1, $2, $3, 'dry_run', $4, $5)`,
          [recipientEmail, template, subject, data.entity_type || null, data.entity_id || null]
        );
      } catch (_) {}
    }
    return true;
  }

  try {
    await sendViaGraph(recipientEmail, subject, html);
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO email_log (recipient, template, subject, status, entity_type, entity_id)
           VALUES ($1, $2, $3, 'sent', $4, $5)`,
          [recipientEmail, template, subject, data.entity_type || null, data.entity_id || null]
        );
      } catch (_) {}
    }
    return true;
  } catch (err) {
    console.error(`Email send error (${template}):`, err.message);
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO email_log (recipient, template, subject, status, error_message)
           VALUES ($1, $2, $3, 'failed', $4)`,
          [recipientEmail, template, subject, err.message]
        );
      } catch (_) {}
    }
    return false;
  }
}

export async function sendRawEmail(pool, recipientEmail, subject, html) {
  const hasGraph = !!(MSGRAPH_TENANT_ID && MSGRAPH_CLIENT_ID && MSGRAPH_CLIENT_SECRET);
  if (!hasGraph) {
    console.log(`[EMAIL-DRY] To: ${recipientEmail} | Subject: ${subject}`);
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO email_log (recipient, template, subject, status) VALUES ($1, 'raw', $2, 'dry_run')`,
          [recipientEmail, subject]
        );
      } catch (_) {}
    }
    return true;
  }

  try {
    await sendViaGraph(recipientEmail, subject, html);
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO email_log (recipient, template, subject, status) VALUES ($1, 'raw', $2, 'sent')`,
          [recipientEmail, subject]
        );
      } catch (_) {}
    }
    return true;
  } catch (err) {
    console.error(`Raw email error:`, err.message);
    return false;
  }
}

export async function sendInternalAlert(pool, template, data) {
  const internalEmail = process.env.INTERNAL_ALERT_EMAIL || 'sales@doganconsult.com';
  return sendEmail(pool, template, data, internalEmail, 'en');
}
