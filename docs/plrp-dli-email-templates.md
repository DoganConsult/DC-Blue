# PLRP + DLI Email Templates (AR/EN)

Use these keys in your email service. Replace `{ticket_number}`, `{product_name}`, `{company_name}`, `{reason}` as needed.

---

## 1. Customer confirmation (DLI — after public submit)

**Trigger:** POST /api/v1/public/inquiries success

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | We received your request – Ticket #{ticket_number} | Thank you for your interest. We have received your request regarding **{product_name}** and will contact you within 24 hours. Your reference number: **{ticket_number}**. |
| AR | تم استلام طلبك – رقم #{ticket_number} | شكراً لاهتمامكم. تم استلام طلبكم بخصوص **{product_name}** وسنتواصل معكم خلال 24 ساعة. رقم المراجع: **{ticket_number}**. |

---

## 2. Need more info (low score / needs_info)

**Trigger:** Lead status set to needs_info (optional auto or manual)

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | A few details needed for your inquiry #{ticket_number} | To better assist you, could you please provide: [X]. Reply to this email or use your reference number {ticket_number}. |
| AR | تفاصيل إضافية مطلوبة لاستفسارك #{ticket_number} | للمساعدة بشكل أفضل، هل يمكنكم تزويدنا بـ: [X]. الرد على هذا البريد أو استخدام رقم المراجع {ticket_number}. |

---

## 3. Partner – lead submitted

**Trigger:** POST /api/v1/partners/leads success

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | Lead submitted – Ticket #{ticket_number} | Your lead for **{company_name}** has been received. Reference: **{ticket_number}**. We will review and respond within 2 business days. |
| AR | تم إرسال العميل – رقم #{ticket_number} | تم استلام العميل المحتمل **{company_name}**. المراجع: **{ticket_number}**. سنراجع ونرد خلال يومي عمل. |

---

## 4. Partner – lead approved

**Trigger:** Admin approves partner lead

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | Your lead has been approved – Ticket #{ticket_number} | Your lead for **{company_name}** has been approved. Exclusivity period has started. Our team will follow up with the prospect. |
| AR | تمت الموافقة على العميل – رقم #{ticket_number} | تمت الموافقة على العميل **{company_name}**. بدأت فترة الحصر. سيتابع فريقنا مع العميل المحتمل. |

---

## 5. Partner – lead rejected

**Trigger:** Admin rejects partner lead

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | Lead not approved – Ticket #{ticket_number} | Your lead for **{company_name}** could not be approved. Reason: **{reason}**. Contact us if you have questions. |
| AR | لم تتم الموافقة على العميل – رقم #{ticket_number} | لم تتم الموافقة على العميل **{company_name}**. السبب: **{reason}**. تواصل معنا لأي استفسار. |

---

## 6. Internal new lead alert

**Trigger:** Any new lead (DLI or partner)

| Lang | Subject | Body (snippet) |
|------|--------|----------------|
| EN | New inbound lead – {product_line} – {company_name} | Lead from {source}. Ticket: {ticket_number}. Contact: {contact_name} ({contact_email}). Assigned to: {assigned_to}. Score: {score}. |
| AR | عميل محتمل جديد – {product_line} – {company_name} | عميل من {source}. الرقم: {ticket_number}. جهة الاتصال: {contact_name} ({contact_email}). مُعيَّن إلى: {assigned_to}. النقاط: {score}. |

---

## PDPL / Consent wording (for forms)

- **EN:** I consent to Dogan Consult processing my data in accordance with Saudi Arabia's Personal Data Protection Law (PDPL) to respond to this inquiry.
- **AR:** أوافق على معالجة بياناتي من قبل دوقان للاستشارات وفقًا لنظام حماية البيانات الشخصية (PDPL) للرد على هذا الاستفسار.

## Partner declaration (PLRP)

- **EN:** I confirm that the information provided is accurate and that I have the prospect's permission to share their contact details. I acknowledge the non-circumvention terms of the Partner Program.
- **AR:** أؤكد أن المعلومات المقدمة دقيقة وأن لدي موافقة العميل المحتمل على مشاركة بيانات الاتصال. أوافق على بنود عدم الالتفاف في برنامج الشركاء.
