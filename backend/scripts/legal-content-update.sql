-- ============================================================
-- Legal Pages — Real content for KSA PDPL compliance
-- Run: psql -U doganconsult -d doganconsult -f legal-content-update.sql
-- ============================================================

-- Privacy Policy
UPDATE legal_pages SET
  title_en = 'Privacy Policy',
  title_ar = 'سياسة الخصوصية',
  body_en = '
<h2>Introduction</h2>
<p>Dogan Consult ("we", "our", "us") is committed to protecting your personal data in accordance with the Kingdom of Saudi Arabia''s Personal Data Protection Law (PDPL) and international best practices. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

<h2>Data Controller</h2>
<p><strong>Dogan Consult</strong><br/>
Riyadh, Kingdom of Saudi Arabia<br/>
CR Number: 7008903317<br/>
Email: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a></p>

<h2>Information We Collect</h2>
<h3>Information You Provide</h3>
<ul>
  <li><strong>Contact Information</strong>: Name, email address, phone number, company name, job title</li>
  <li><strong>Inquiry Details</strong>: Service interests, project requirements, budget range, timeline</li>
  <li><strong>Account Information</strong>: Login credentials for our portal (encrypted)</li>
  <li><strong>Communication Records</strong>: Messages exchanged through our platform</li>
</ul>

<h3>Automatically Collected Information</h3>
<ul>
  <li><strong>Technical Data</strong>: IP address, browser type, device information, operating system</li>
  <li><strong>Usage Data</strong>: Pages visited, time spent, navigation patterns</li>
  <li><strong>Cookies</strong>: Session cookies for authentication, preference cookies for language/theme settings</li>
</ul>

<h2>How We Use Your Information</h2>
<ul>
  <li>To respond to your inquiries and provide requested services</li>
  <li>To manage your account and portal access</li>
  <li>To process and track service engagements</li>
  <li>To send transactional emails (confirmations, status updates, invoices)</li>
  <li>To improve our services and user experience</li>
  <li>To comply with legal and regulatory obligations in KSA</li>
</ul>

<h2>Legal Basis for Processing</h2>
<p>We process your personal data based on:</p>
<ul>
  <li><strong>Your consent</strong>: When you submit inquiry forms or register an account</li>
  <li><strong>Contractual necessity</strong>: To fulfill our service agreements</li>
  <li><strong>Legal obligation</strong>: Compliance with KSA regulations, tax, and commercial laws</li>
  <li><strong>Legitimate interest</strong>: To improve our services and maintain platform security</li>
</ul>

<h2>Data Sharing</h2>
<p>We do <strong>not</strong> sell your personal data. We may share data with:</p>
<ul>
  <li><strong>Service partners</strong>: Only when necessary to deliver requested ICT services, under strict contractual obligations</li>
  <li><strong>Government authorities</strong>: When required by KSA law or regulation</li>
  <li><strong>Cloud providers</strong>: Our hosting infrastructure providers (data stored within KSA or GCC region where possible)</li>
</ul>

<h2>Data Retention</h2>
<p>We retain personal data only as long as necessary for the purposes outlined above, or as required by law. Typical retention periods:</p>
<ul>
  <li>Account data: Duration of account plus 2 years</li>
  <li>Inquiry data: 3 years from last interaction</li>
  <li>Financial records: 7 years (KSA tax requirements)</li>
  <li>Log data: 12 months</li>
</ul>

<h2>Your Rights Under PDPL</h2>
<p>You have the right to:</p>
<ul>
  <li><strong>Access</strong> your personal data we hold</li>
  <li><strong>Correct</strong> inaccurate or incomplete data</li>
  <li><strong>Delete</strong> your data (subject to legal retention requirements)</li>
  <li><strong>Withdraw consent</strong> at any time</li>
  <li><strong>Object</strong> to processing based on legitimate interest</li>
  <li><strong>Data portability</strong> — receive your data in a structured format</li>
</ul>
<p>To exercise these rights, contact us at <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a>.</p>

<h2>Data Security</h2>
<p>We implement industry-standard security measures including:</p>
<ul>
  <li>TLS/SSL encryption for all data in transit</li>
  <li>Encrypted password storage (bcrypt hashing)</li>
  <li>Role-based access controls</li>
  <li>Regular security assessments</li>
  <li>Multi-factor authentication (MFA) for portal access</li>
</ul>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy periodically. Material changes will be communicated via our website or email notification. Last updated: March 2026.</p>

<h2>Contact Us</h2>
<p>For privacy-related inquiries:<br/>
Email: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a><br/>
Address: Riyadh, Kingdom of Saudi Arabia</p>
',
  body_ar = '
<h2>مقدمة</h2>
<p>تلتزم شركة دوغان للاستشارات ("نحن"، "لنا"، "خاصتنا") بحماية بياناتكم الشخصية وفقاً لنظام حماية البيانات الشخصية (PDPL) في المملكة العربية السعودية وأفضل الممارسات الدولية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام والإفصاح عن معلوماتكم وحمايتها عند زيارة موقعنا الإلكتروني أو استخدام خدماتنا.</p>

<h2>مسؤول البيانات</h2>
<p><strong>دوغان للاستشارات</strong><br/>
الرياض، المملكة العربية السعودية<br/>
رقم السجل التجاري: 7008903317<br/>
البريد الإلكتروني: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a></p>

<h2>المعلومات التي نجمعها</h2>
<h3>المعلومات التي تقدمونها</h3>
<ul>
  <li><strong>معلومات الاتصال</strong>: الاسم، البريد الإلكتروني، رقم الهاتف، اسم الشركة، المسمى الوظيفي</li>
  <li><strong>تفاصيل الاستفسار</strong>: الخدمات المطلوبة، متطلبات المشروع، نطاق الميزانية، الجدول الزمني</li>
  <li><strong>معلومات الحساب</strong>: بيانات تسجيل الدخول لبوابتنا (مشفرة)</li>
  <li><strong>سجلات الاتصال</strong>: الرسائل المتبادلة عبر منصتنا</li>
</ul>

<h2>كيف نستخدم معلوماتكم</h2>
<ul>
  <li>للرد على استفساراتكم وتقديم الخدمات المطلوبة</li>
  <li>لإدارة حسابكم والوصول إلى البوابة</li>
  <li>لمعالجة وتتبع المشاريع</li>
  <li>لإرسال رسائل البريد الإلكتروني (التأكيدات، تحديثات الحالة، الفواتير)</li>
  <li>لتحسين خدماتنا وتجربة المستخدم</li>
  <li>للامتثال للالتزامات القانونية والتنظيمية في المملكة العربية السعودية</li>
</ul>

<h2>حقوقكم بموجب نظام حماية البيانات الشخصية</h2>
<ul>
  <li><strong>الوصول</strong> إلى بياناتكم الشخصية التي نحتفظ بها</li>
  <li><strong>تصحيح</strong> البيانات غير الدقيقة أو غير المكتملة</li>
  <li><strong>حذف</strong> بياناتكم (مع مراعاة متطلبات الاحتفاظ القانونية)</li>
  <li><strong>سحب الموافقة</strong> في أي وقت</li>
  <li><strong>الاعتراض</strong> على المعالجة القائمة على المصلحة المشروعة</li>
  <li><strong>نقل البيانات</strong> — استلام بياناتكم بتنسيق منظم</li>
</ul>
<p>لممارسة هذه الحقوق، تواصلوا معنا على <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a>.</p>

<h2>اتصلوا بنا</h2>
<p>للاستفسارات المتعلقة بالخصوصية:<br/>
البريد الإلكتروني: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a><br/>
العنوان: الرياض، المملكة العربية السعودية</p>
',
  updated_at = NOW()
WHERE key = 'privacy';

-- Terms of Use
UPDATE legal_pages SET
  title_en = 'Terms of Use',
  title_ar = 'شروط الاستخدام',
  body_en = '
<h2>Acceptance of Terms</h2>
<p>By accessing and using the Dogan Consult website and platform ("Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.</p>

<h2>About Dogan Consult</h2>
<p>Dogan Consult is an ICT engineering consultancy registered in the Kingdom of Saudi Arabia (CR: 7008903317), providing advisory, design, implementation, and managed services for enterprise technology environments.</p>

<h2>Use of the Service</h2>
<h3>Permitted Use</h3>
<ul>
  <li>Submit inquiries for ICT consulting services</li>
  <li>Access your customer or partner portal workspace</li>
  <li>Track project status, opportunities, and engagements</li>
  <li>Communicate with our team through the messaging system</li>
  <li>Download resources and documents shared with you</li>
</ul>

<h3>Prohibited Use</h3>
<p>You agree not to:</p>
<ul>
  <li>Attempt unauthorized access to the platform or other users'' accounts</li>
  <li>Transmit malicious code, spam, or harmful content</li>
  <li>Use the platform for purposes other than legitimate business engagement</li>
  <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
  <li>Scrape, data-mine, or systematically extract content</li>
  <li>Violate any applicable local, national, or international law</li>
</ul>

<h2>Accounts and Security</h2>
<ul>
  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
  <li>You must notify us immediately of any unauthorized use of your account</li>
  <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
  <li>Multi-factor authentication (MFA) is available and recommended for enhanced security</li>
</ul>

<h2>Intellectual Property</h2>
<p>All content, design, code, and materials on the Dogan Consult platform are owned by or licensed to Dogan Consult. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
<p>Proposals, reports, and deliverables created specifically for your engagement are subject to the terms of your service agreement.</p>

<h2>Service Availability</h2>
<p>We strive to maintain platform availability but do not guarantee uninterrupted access. Scheduled maintenance windows will be communicated in advance where possible.</p>

<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Dogan Consult shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of the Service. Our total liability shall not exceed the fees paid for the specific service in question.</p>

<h2>Governing Law</h2>
<p>These Terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes shall be resolved through the competent courts in Riyadh, Saudi Arabia.</p>

<h2>Changes to Terms</h2>
<p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance. Last updated: March 2026.</p>

<h2>Contact</h2>
<p>For questions about these Terms:<br/>
Email: <a href="mailto:legal@doganconsult.com">legal@doganconsult.com</a><br/>
Dogan Consult, Riyadh, Kingdom of Saudi Arabia</p>
',
  body_ar = '
<h2>قبول الشروط</h2>
<p>بالوصول إلى موقع وبوابة دوغان للاستشارات ("الخدمة") واستخدامها، فإنكم توافقون على الالتزام بشروط الاستخدام هذه. إذا لم توافقوا، يرجى عدم استخدام الخدمة.</p>

<h2>حول دوغان للاستشارات</h2>
<p>دوغان للاستشارات هي شركة استشارات هندسة تقنية المعلومات والاتصالات مسجلة في المملكة العربية السعودية (سجل تجاري: 7008903317)، تقدم خدمات الاستشارات والتصميم والتنفيذ والخدمات المدارة لبيئات التقنية المؤسسية.</p>

<h2>الاستخدام المسموح</h2>
<ul>
  <li>تقديم الاستفسارات عن خدمات استشارات تقنية المعلومات</li>
  <li>الوصول إلى بوابة العملاء أو الشركاء</li>
  <li>تتبع حالة المشاريع والفرص</li>
  <li>التواصل مع فريقنا من خلال نظام المراسلة</li>
  <li>تحميل الموارد والمستندات المشتركة معكم</li>
</ul>

<h2>الاستخدام المحظور</h2>
<ul>
  <li>محاولة الوصول غير المصرح به إلى المنصة</li>
  <li>إرسال رمز ضار أو محتوى مزعج</li>
  <li>استخدام المنصة لأغراض غير مشروعة</li>
  <li>الهندسة العكسية لأي جزء من الخدمة</li>
  <li>انتهاك أي قانون محلي أو دولي معمول به</li>
</ul>

<h2>القانون الحاكم</h2>
<p>تخضع هذه الشروط لقوانين المملكة العربية السعودية. يتم حل أي نزاعات من خلال المحاكم المختصة في الرياض.</p>

<h2>اتصلوا بنا</h2>
<p>للأسئلة حول هذه الشروط:<br/>
البريد الإلكتروني: <a href="mailto:legal@doganconsult.com">legal@doganconsult.com</a><br/>
دوغان للاستشارات، الرياض، المملكة العربية السعودية</p>
',
  updated_at = NOW()
WHERE key = 'terms';

-- PDPL Compliance
UPDATE legal_pages SET
  title_en = 'Personal Data Protection (PDPL) Compliance',
  title_ar = 'الامتثال لنظام حماية البيانات الشخصية (PDPL)',
  body_en = '
<h2>Our Commitment to PDPL</h2>
<p>Dogan Consult is fully committed to compliance with the Kingdom of Saudi Arabia''s Personal Data Protection Law (Royal Decree M/19 of 1443H). This page outlines how we implement PDPL requirements across our operations.</p>

<h2>PDPL Principles We Follow</h2>
<ol>
  <li><strong>Lawfulness and Transparency</strong>: We process personal data based on clear legal grounds and communicate our practices openly.</li>
  <li><strong>Purpose Limitation</strong>: Data is collected only for specific, explicit, and legitimate purposes.</li>
  <li><strong>Data Minimization</strong>: We collect only the data necessary for our stated purposes.</li>
  <li><strong>Accuracy</strong>: We take reasonable steps to ensure personal data is accurate and up to date.</li>
  <li><strong>Storage Limitation</strong>: Data is retained only as long as necessary.</li>
  <li><strong>Integrity and Confidentiality</strong>: We implement appropriate technical and organizational measures to protect data.</li>
</ol>

<h2>Consent Management</h2>
<p>Where we rely on consent for data processing:</p>
<ul>
  <li>Consent is obtained before data collection (e.g., inquiry forms include explicit PDPL consent checkbox)</li>
  <li>Consent is freely given, specific, informed, and unambiguous</li>
  <li>You may withdraw consent at any time without affecting the lawfulness of prior processing</li>
  <li>Withdrawal of consent is as easy as giving it</li>
</ul>

<h2>Data Subject Rights</h2>
<p>Under PDPL, you have the following rights:</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <tr style="border-bottom:1px solid #e0e0e0;">
    <th style="text-align:left;padding:8px;font-weight:600;">Right</th>
    <th style="text-align:left;padding:8px;font-weight:600;">Description</th>
    <th style="text-align:left;padding:8px;font-weight:600;">Response Time</th>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;">Right of Access</td>
    <td style="padding:8px;">Request a copy of your personal data</td>
    <td style="padding:8px;">Within 30 days</td>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;">Right to Rectification</td>
    <td style="padding:8px;">Correct inaccurate or incomplete data</td>
    <td style="padding:8px;">Within 15 days</td>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;">Right to Erasure</td>
    <td style="padding:8px;">Request deletion of your data</td>
    <td style="padding:8px;">Within 30 days</td>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;">Right to Object</td>
    <td style="padding:8px;">Object to data processing</td>
    <td style="padding:8px;">Within 15 days</td>
  </tr>
  <tr>
    <td style="padding:8px;">Right to Portability</td>
    <td style="padding:8px;">Receive data in a machine-readable format</td>
    <td style="padding:8px;">Within 30 days</td>
  </tr>
</table>

<h2>Cross-Border Data Transfer</h2>
<p>Where personal data is transferred outside KSA (e.g., to cloud service providers), we ensure:</p>
<ul>
  <li>Adequate data protection measures are in place</li>
  <li>Transfer is based on approved mechanisms under PDPL</li>
  <li>Contractual safeguards protect your data</li>
</ul>

<h2>Data Breach Notification</h2>
<p>In the event of a personal data breach:</p>
<ul>
  <li>We notify the Saudi Data and AI Authority (SDAIA) as required by PDPL</li>
  <li>Affected individuals are notified without undue delay when the breach is likely to result in high risk</li>
  <li>We maintain a breach register and conduct post-incident reviews</li>
</ul>

<h2>Contact Our Data Protection Team</h2>
<p>For PDPL-related inquiries or to exercise your rights:<br/>
Email: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a><br/>
Dogan Consult, Riyadh, Kingdom of Saudi Arabia</p>
',
  body_ar = '
<h2>التزامنا بنظام حماية البيانات الشخصية</h2>
<p>تلتزم دوغان للاستشارات التزاماً كاملاً بنظام حماية البيانات الشخصية في المملكة العربية السعودية (المرسوم الملكي م/19 لعام 1443هـ). توضح هذه الصفحة كيفية تنفيذنا لمتطلبات النظام عبر عملياتنا.</p>

<h2>مبادئ النظام التي نتبعها</h2>
<ol>
  <li><strong>المشروعية والشفافية</strong>: نعالج البيانات الشخصية استناداً إلى أسس قانونية واضحة.</li>
  <li><strong>تحديد الغرض</strong>: تُجمع البيانات فقط لأغراض محددة وصريحة ومشروعة.</li>
  <li><strong>تقليل البيانات</strong>: نجمع فقط البيانات اللازمة لأغراضنا المحددة.</li>
  <li><strong>الدقة</strong>: نتخذ خطوات معقولة لضمان دقة البيانات الشخصية وتحديثها.</li>
  <li><strong>تحديد التخزين</strong>: تُحتفظ بالبيانات فقط طالما كان ذلك ضرورياً.</li>
  <li><strong>السلامة والسرية</strong>: ننفذ تدابير تقنية وتنظيمية مناسبة لحماية البيانات.</li>
</ol>

<h2>حقوق أصحاب البيانات</h2>
<ul>
  <li>حق الوصول إلى بياناتكم الشخصية</li>
  <li>حق تصحيح البيانات غير الدقيقة</li>
  <li>حق محو البيانات</li>
  <li>حق الاعتراض على المعالجة</li>
  <li>حق نقل البيانات</li>
</ul>

<h2>اتصلوا بفريق حماية البيانات</h2>
<p>للاستفسارات المتعلقة بنظام حماية البيانات الشخصية أو لممارسة حقوقكم:<br/>
البريد الإلكتروني: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a><br/>
دوغان للاستشارات، الرياض، المملكة العربية السعودية</p>
',
  updated_at = NOW()
WHERE key = 'pdpl';

-- Cookie Policy
UPDATE legal_pages SET
  title_en = 'Cookie Policy',
  title_ar = 'سياسة ملفات تعريف الارتباط',
  body_en = '
<h2>What Are Cookies?</h2>
<p>Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and understanding how you use our platform.</p>

<h2>Cookies We Use</h2>

<h3>Essential Cookies (Required)</h3>
<p>These cookies are necessary for the platform to function and cannot be disabled.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <tr style="border-bottom:1px solid #e0e0e0;">
    <th style="text-align:left;padding:8px;">Cookie</th>
    <th style="text-align:left;padding:8px;">Purpose</th>
    <th style="text-align:left;padding:8px;">Duration</th>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;"><code>dc_user_token</code></td>
    <td style="padding:8px;">Authentication (JWT token for logged-in users)</td>
    <td style="padding:8px;">7 days</td>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;"><code>dc_user</code></td>
    <td style="padding:8px;">User profile data for portal display</td>
    <td style="padding:8px;">7 days</td>
  </tr>
  <tr>
    <td style="padding:8px;"><code>cookie_consent</code></td>
    <td style="padding:8px;">Records your cookie preference</td>
    <td style="padding:8px;">1 year</td>
  </tr>
</table>

<h3>Preference Cookies (Optional)</h3>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <tr style="border-bottom:1px solid #e0e0e0;">
    <th style="text-align:left;padding:8px;">Cookie</th>
    <th style="text-align:left;padding:8px;">Purpose</th>
    <th style="text-align:left;padding:8px;">Duration</th>
  </tr>
  <tr style="border-bottom:1px solid #f0f0f0;">
    <td style="padding:8px;"><code>dc_theme</code></td>
    <td style="padding:8px;">Theme preference (light/dark/navy)</td>
    <td style="padding:8px;">1 year</td>
  </tr>
  <tr>
    <td style="padding:8px;"><code>dc_lang</code></td>
    <td style="padding:8px;">Language preference (en/ar)</td>
    <td style="padding:8px;">1 year</td>
  </tr>
</table>

<h2>We Do NOT Use</h2>
<ul>
  <li>Third-party advertising cookies</li>
  <li>Social media tracking pixels</li>
  <li>Cross-site tracking technologies</li>
  <li>Google Analytics or similar tracking services</li>
</ul>

<h2>Managing Cookies</h2>
<p>You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality (e.g., you may need to log in each visit).</p>

<h2>Changes to This Policy</h2>
<p>We may update this Cookie Policy from time to time. Last updated: March 2026.</p>

<h2>Contact</h2>
<p>For questions about our cookie practices:<br/>
Email: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a></p>
',
  body_ar = '
<h2>ما هي ملفات تعريف الارتباط؟</h2>
<p>ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزن على جهازكم عند زيارة موقع إلكتروني. تساعدنا في تقديم تجربة أفضل من خلال تذكر تفضيلاتكم وفهم كيفية استخدامكم لمنصتنا.</p>

<h2>ملفات تعريف الارتباط التي نستخدمها</h2>
<h3>ملفات أساسية (مطلوبة)</h3>
<p>هذه الملفات ضرورية لعمل المنصة ولا يمكن تعطيلها.</p>
<ul>
  <li><code>dc_user_token</code> — المصادقة (رمز JWT للمستخدمين المسجلين)</li>
  <li><code>dc_user</code> — بيانات ملف المستخدم لعرض البوابة</li>
  <li><code>cookie_consent</code> — تسجيل تفضيل ملفات تعريف الارتباط</li>
</ul>

<h3>ملفات التفضيلات (اختيارية)</h3>
<ul>
  <li><code>dc_theme</code> — تفضيل السمة (فاتح/داكن/أزرق داكن)</li>
  <li><code>dc_lang</code> — تفضيل اللغة (عربي/إنجليزي)</li>
</ul>

<h2>لا نستخدم</h2>
<ul>
  <li>ملفات تعريف الارتباط الإعلانية من أطراف ثالثة</li>
  <li>بكسلات تتبع وسائل التواصل الاجتماعي</li>
  <li>تقنيات التتبع عبر المواقع</li>
</ul>

<h2>اتصلوا بنا</h2>
<p>للأسئلة حول ممارسات ملفات تعريف الارتباط:<br/>
البريد الإلكتروني: <a href="mailto:privacy@doganconsult.com">privacy@doganconsult.com</a></p>
',
  updated_at = NOW()
WHERE key = 'cookies';

-- admin_settings migration (ensure table exists in proper migration)
CREATE TABLE IF NOT EXISTS admin_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- partner training courses seed data
CREATE TABLE IF NOT EXISTS partner_training_courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  description TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'platform',
  difficulty VARCHAR(32) DEFAULT 'beginner',
  duration_minutes INT DEFAULT 30,
  thumbnail_url VARCHAR(512),
  content_url VARCHAR(512),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partner_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  description TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'general',
  file_type VARCHAR(16) DEFAULT 'PDF',
  file_url VARCHAR(512),
  file_size_bytes BIGINT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some training courses
INSERT INTO partner_training_courses (title, description, category, difficulty, duration_minutes, sort_order) VALUES
  ('Platform Overview', 'Learn the basics of the Dogan Consult Partner Portal — navigation, features, and key workflows.', 'platform', 'beginner', 15, 1),
  ('Submitting Your First Lead', 'Step-by-step guide to submitting leads through the portal, including required fields and best practices.', 'platform', 'beginner', 20, 2),
  ('Understanding the Sales Pipeline', 'Learn how opportunities progress through stages, from qualification to closing.', 'sales', 'intermediate', 30, 3),
  ('ICT Solutions Portfolio', 'Overview of Dogan Consult''s service offerings: Network, Security, Cloud, and Systems Integration.', 'technical', 'beginner', 25, 4),
  ('Commission Structure & Payouts', 'Understand how commissions are calculated, approved, and paid out.', 'sales', 'beginner', 15, 5),
  ('KSA Regulatory Compliance', 'Key compliance requirements for ICT projects in Saudi Arabia including NCA, CITC, and PDPL.', 'compliance', 'intermediate', 30, 6),
  ('Advanced Lead Qualification', 'Best practices for identifying high-quality leads and improving conversion rates.', 'sales', 'advanced', 40, 7),
  ('API Integration Guide', 'Technical guide for integrating with the Dogan Consult API for automated lead submission.', 'technical', 'advanced', 45, 8)
ON CONFLICT DO NOTHING;

-- Seed some resources
INSERT INTO partner_resources (title, description, category, file_type, sort_order) VALUES
  ('Partner Program Guide', 'Complete guide to the Dogan Consult Partner Program — tiers, benefits, and requirements.', 'general', 'PDF', 1),
  ('Brand Guidelines', 'Logo usage, color palette, and co-branding guidelines for partner materials.', 'marketing', 'PDF', 2),
  ('Solution Brief: Network & Data Center', 'Technical overview of our network infrastructure and data center services.', 'technical', 'PDF', 3),
  ('Solution Brief: Cybersecurity', 'Overview of our cybersecurity assessment, implementation, and managed security services.', 'technical', 'PDF', 4),
  ('Solution Brief: Cloud & DevOps', 'Cloud migration, hybrid architecture, and DevOps transformation services.', 'technical', 'PDF', 5),
  ('Sales Presentation Template', 'Customizable sales deck for partner-led customer presentations.', 'marketing', 'PPTX', 6),
  ('ROI Calculator', 'Excel-based ROI calculator for ICT infrastructure investments.', 'sales', 'XLSX', 7),
  ('KSA Compliance Checklist', 'Regulatory compliance checklist for ICT projects in Saudi Arabia.', 'compliance', 'PDF', 8)
ON CONFLICT DO NOTHING;
