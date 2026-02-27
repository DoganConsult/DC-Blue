import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@doganconsult.com';
const FROM_NAME = process.env.FROM_NAME || 'Dogan Consult';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

const TEMPLATES = {
  inquiry_confirmation: {
    subjectEn: (d) => `We received your request – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تم استلام طلبك – رقم #${d.ticket_number}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Dogan Consult</h2>
        <p>Dear ${d.contact_name || 'Customer'},</p>
        <p>We received your interest for <strong>${d.product_line || 'our services'}</strong>.</p>
        <p>Your reference number: <strong style="color:#E3B76B;">${d.ticket_number}</strong></p>
        <p>We will contact you within <strong>24 hours</strong>.</p>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.6);">Dogan Consult — ICT Engineering Services<br/>www.doganconsult.com</p>
      </div>`,
    bodyAr: (d) => `
      <div dir="rtl" style="font-family:'IBM Plex Arabic',sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">دوغان للاستشارات</h2>
        <p>عزيزي ${d.contact_name || 'العميل'},</p>
        <p>تم استلام اهتمامكم بخصوص <strong>${d.product_line || 'خدماتنا'}</strong>.</p>
        <p>رقم المراجع: <strong style="color:#E3B76B;">${d.ticket_number}</strong></p>
        <p>سنتواصل معكم خلال <strong>24 ساعة</strong>.</p>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.6);">دوغان للاستشارات — خدمات هندسة تقنية المعلومات<br/>www.doganconsult.com</p>
      </div>`,
  },
  internal_new_lead: {
    subjectEn: (d) => `New lead: ${d.company_name} — ${d.product_line || 'General'} [${d.ticket_number}]`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h3>New Lead Received</h3>
        <p><strong>Ticket:</strong> ${d.ticket_number}</p>
        <p><strong>Company:</strong> ${d.company_name}</p>
        <p><strong>Contact:</strong> ${d.contact_name} (${d.contact_email})</p>
        <p><strong>Service:</strong> ${d.product_line || '—'}</p>
        <p><strong>Score:</strong> ${d.score}</p>
        <p><strong>Assigned to:</strong> ${d.assigned_to}</p>
        <p style="margin-top:16px;"><a href="${d.admin_url}" style="background:#0EA5E9;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">View Lead</a></p>
      </div>`,
  },
  partner_submitted: {
    subjectEn: (d) => `Lead submitted – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تم إرسال العميل – رقم #${d.ticket_number}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Dogan Consult — PLRP</h2>
        <p>Your lead for <strong>${d.company_name}</strong> has been submitted.</p>
        <p>Ticket: <strong style="color:#E3B76B;">${d.ticket_number}</strong></p>
        <p>We will review and respond within 2 business days.</p>
      </div>`,
  },
  partner_application_received: {
    subjectEn: () => 'Partner application received — Dogan Consult',
    subjectAr: () => 'تم استلام طلب الشراكة — دوغان للاستشارات',
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Dogan Consult — Partner Program</h2>
        <p>Hi ${d.contact_name || 'there'},</p>
        <p>We received your partner application for <strong>${d.company_name || 'your company'}</strong>.</p>
        <p>Next step: our team will review and approve your account. Once approved, you will receive a separate email with your <strong>API Key</strong> and login instructions.</p>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.75);">If you already registered before, you can request a login email to be resent.</p>
      </div>`,
    bodyAr: (d) => `
      <div dir="rtl" style="font-family:'IBM Plex Arabic',sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">دوغان للاستشارات — برنامج الشركاء</h2>
        <p>مرحباً ${d.contact_name || ''}،</p>
        <p>تم استلام طلب الشراكة الخاص بكم لشركة <strong>${d.company_name || ''}</strong>.</p>
        <p>الخطوة التالية: سيتم مراجعة الطلب، وبعد الموافقة سيتم إرسال <strong>مفتاح API</strong> وتعليمات الدخول برسالة منفصلة.</p>
        <hr style="border-color:rgba(255,255,255,0.2);"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.75);">إذا كنتم قد سجلتم سابقاً يمكنكم طلب إعادة إرسال رسالة الدخول.</p>
      </div>`,
  },
  partner_portal_access: {
    subjectEn: () => 'Your Partner Portal access — Dogan Consult',
    subjectAr: () => 'بيانات دخول بوابة الشركاء — دوغان للاستشارات',
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Partner Portal Access</h2>
        <p>Hi ${d.contact_name || 'Partner'},</p>
        <p>Your partner account for <strong>${d.company_name || 'your company'}</strong> is ready.</p>
        <p><strong>Partner Portal:</strong> <a style="color:#E3B76B;" href="${d.portal_url}">${d.portal_url}</a></p>
        <p><strong>Your API Key:</strong></p>
        <div style="background:rgba(0,0,0,0.25);padding:12px;border-radius:10px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;word-break:break-all;">${d.api_key}</div>
        <p style="margin-top:16px;">Login steps:</p>
        <ol>
          <li>Open the Partner Portal link above.</li>
          <li>Paste your API Key.</li>
          <li>Click <strong>Access Dashboard</strong>.</li>
        </ol>
        <p style="font-size:12px;color:rgba(255,255,255,0.75);">Keep this API key secure. Anyone with this key can access your partner dashboard.</p>
      </div>`,
    bodyAr: (d) => `
      <div dir="rtl" style="font-family:'IBM Plex Arabic',sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">بيانات دخول بوابة الشركاء</h2>
        <p>مرحباً ${d.contact_name || ''}،</p>
        <p>تم تفعيل حساب الشريك لشركة <strong>${d.company_name || ''}</strong>.</p>
        <p><strong>بوابة الشركاء:</strong> <a style="color:#E3B76B;" href="${d.portal_url}">${d.portal_url}</a></p>
        <p><strong>مفتاح API:</strong></p>
        <div style="background:rgba(0,0,0,0.25);padding:12px;border-radius:10px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;word-break:break-all;">${d.api_key}</div>
        <p style="margin-top:16px;">خطوات الدخول:</p>
        <ol>
          <li>افتح رابط بوابة الشركاء أعلاه.</li>
          <li>الصق مفتاح API.</li>
          <li>اضغط <strong>الدخول</strong>.</li>
        </ol>
        <p style="font-size:12px;color:rgba(255,255,255,0.75);">يرجى حفظ مفتاح API بأمان.</p>
      </div>`,
  },
  partner_approved: {
    subjectEn: (d) => `Your lead has been approved – Ticket #${d.ticket_number}`,
    subjectAr: (d) => `تمت الموافقة على العميل – رقم #${d.ticket_number}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Lead Approved</h2>
        <p>Your lead for <strong>${d.company_name}</strong> (${d.ticket_number}) has been <strong style="color:#10B981;">approved</strong>.</p>
        <p>Exclusivity window has started. We will keep you updated on progress.</p>
      </div>`,
  },
  partner_rejected: {
    subjectEn: (d) => `Lead update – Ticket #${d.ticket_number}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Lead Not Approved</h2>
        <p>Your lead for <strong>${d.company_name}</strong> (${d.ticket_number}) was not approved.</p>
        ${d.reason ? `<p>Reason: ${d.reason}</p>` : ''}
        <p>Contact us if you have questions.</p>
      </div>`,
  },
  stage_update: {
    subjectEn: (d) => `Opportunity update: ${d.company_name} moved to ${d.new_stage}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Stage Update</h2>
        <p>Opportunity for <strong>${d.company_name}</strong> has moved to <strong>${d.new_stage}</strong>.</p>
        <p>Ticket: ${d.ticket_number}</p>
      </div>`,
  },
  commission_created: {
    subjectEn: (d) => `Commission eligible – ${d.company_name}`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A3C6B;color:#fff;border-radius:12px;">
        <h2 style="color:#E3B76B;">Commission Notification</h2>
        <p>Deal for <strong>${d.company_name}</strong> has been closed won.</p>
        <p>Commission amount: <strong style="color:#10B981;">${d.amount} ${d.currency}</strong></p>
        <p>Status: Pending approval</p>
      </div>`,
  },
  sla_breach_warning: {
    subjectEn: (d) => `SLA Warning: Lead #${d.ticket_number} needs attention`,
    bodyEn: (d) => `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h3 style="color:#EF4444;">SLA Breach Warning</h3>
        <p>Lead <strong>${d.ticket_number}</strong> (${d.company_name}) has been in "${d.status}" status for over ${d.hours} hours.</p>
        <p>Assigned to: ${d.assigned_to}</p>
        <p><a href="${d.admin_url}" style="background:#EF4444;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Take Action</a></p>
      </div>`,
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

  const transport = getTransporter();
  if (!transport) {
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
    await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject,
      html,
    });
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

export async function sendInternalAlert(pool, template, data) {
  const internalEmail = process.env.INTERNAL_ALERT_EMAIL || 'sales@doganconsult.com';
  return sendEmail(pool, template, data, internalEmail, 'en');
}
