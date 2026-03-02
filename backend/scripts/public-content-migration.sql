-- ============================================================
-- Public content & site settings — Autonomous Consultant Office Platform
-- Tables: site_settings, public_content, legal_pages
-- ============================================================

-- 1. site_settings — single row (contact, WhatsApp, socials)
CREATE TABLE IF NOT EXISTS site_settings (
  id                SERIAL PRIMARY KEY,
  contact_email     VARCHAR(256),
  contact_phone     VARCHAR(64),
  whatsapp_number   VARCHAR(32),
  address_en        TEXT,
  address_ar        TEXT,
  cr_number         VARCHAR(64),
  linkedin_url      VARCHAR(512),
  twitter_url       VARCHAR(512),
  locale            VARCHAR(8) DEFAULT 'en',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        VARCHAR(256),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Allow only one row
INSERT INTO site_settings (id, contact_email, whatsapp_number, address_en, address_ar, cr_number, linkedin_url, twitter_url)
VALUES (
  1,
  'info@doganconsult.com',
  '966500000000',
  'Riyadh, Kingdom of Saudi Arabia',
  'الرياض، المملكة العربية السعودية',
  '7008903317',
  'https://linkedin.com/company/doganconsult',
  'https://twitter.com/doganconsult'
)
ON CONFLICT (id) DO NOTHING;

-- 2. public_content — page-driven content (landing, about, services, case_studies, insights)
CREATE TABLE IF NOT EXISTS public_content (
  id          SERIAL PRIMARY KEY,
  page        VARCHAR(64) NOT NULL UNIQUE,
  content     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  VARCHAR(256)
);

CREATE INDEX IF NOT EXISTS idx_public_content_page ON public_content (page);

-- 3. legal_pages — privacy, terms, pdpl, cookies
CREATE TABLE IF NOT EXISTS legal_pages (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(64) NOT NULL UNIQUE,
  title_en    VARCHAR(512),
  title_ar    VARCHAR(512),
  body_en     TEXT,
  body_ar     TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  VARCHAR(256)
);

CREATE INDEX IF NOT EXISTS idx_legal_pages_key ON legal_pages (key);

-- Seed default landing content (matches server.js defaultLanding)
INSERT INTO public_content (page, content) VALUES (
  'landing',
  '{
    "hero": {
      "headline": { "en": "ICT Engineering, Delivered.", "ar": "هندسة تقنية المعلومات والاتصالات، مُنفّذة." },
      "subline": { "en": "Design, build, and operate enterprise-grade ICT environments.", "ar": "نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية." },
      "cta": { "en": "Request Proposal", "ar": "طلب عرض" }
    },
    "stats": [
      { "value": 15, "suffix": "+", "label": { "en": "Years Experience", "ar": "سنوات خبرة" } },
      { "value": 120, "suffix": "+", "label": { "en": "Projects Delivered", "ar": "مشاريع منجزة" } },
      { "value": 99, "suffix": "%", "label": { "en": "SLAs Met", "ar": "التزام ب SLA" } },
      { "value": 6, "suffix": "", "label": { "en": "Regions", "ar": "مناطق" } }
    ],
    "services": [
      { "id": "1", "title": { "en": "Network & Data Center", "ar": "الشبكات ومركز البيانات" }, "color": "#0078D4" },
      { "id": "2", "title": { "en": "Cybersecurity", "ar": "الأمن السيبراني" }, "color": "#006C35" },
      { "id": "3", "title": { "en": "Cloud & DevOps", "ar": "السحابة و DevOps" }, "color": "#6366F1" },
      { "id": "4", "title": { "en": "Systems Integration", "ar": "تكامل الأنظمة" }, "color": "#10B981" }
    ],
    "chartData": { "labels": ["Q1", "Q2", "Q3", "Q4"], "values": [72, 85, 78, 92] }
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

-- Placeholder content for about, services, case_studies, insights (empty blocks for now)
INSERT INTO public_content (page, content) VALUES
  ('about', '{"sections": []}'::jsonb),
  ('services', '{"sections": []}'::jsonb),
  ('case_studies', '{"sections": []}'::jsonb),
  ('insights', '{"sections": []}'::jsonb)
ON CONFLICT (page) DO NOTHING;

-- Seed legal pages with placeholder text
INSERT INTO legal_pages (key, title_en, title_ar, body_en, body_ar) VALUES
  ('privacy', 'Privacy Policy', 'سياسة الخصوصية', '<p>Privacy policy content. Update via admin or database.</p>', '<p>محتوى سياسة الخصوصية. يتم التحديث عبر الإدارة أو قاعدة البيانات.</p>'),
  ('terms', 'Terms of Use', 'شروط الاستخدام', '<p>Terms of use content. Update via admin or database.</p>', '<p>محتوى شروط الاستخدام. يتم التحديث عبر الإدارة أو قاعدة البيانات.</p>'),
  ('pdpl', 'Personal Data Protection (PDPL)', 'حماية البيانات الشخصية (PDPL)', '<p>PDPL compliance information. Update via admin or database.</p>', '<p>معلومات الامتثال لـ PDPL. يتم التحديث عبر الإدارة أو قاعدة البيانات.</p>'),
  ('cookies', 'Cookie Policy', 'سياسة ملفات تعريف الارتباط', '<p>Cookie policy content. Update via admin or database.</p>', '<p>محتوى سياسة ملفات تعريف الارتباط. يتم التحديث عبر الإدارة أو قاعدة البيانات.</p>')
ON CONFLICT (key) DO NOTHING;
