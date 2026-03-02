-- Partner Training Portal tables + Resource Library seed data

-- Training courses table
CREATE TABLE IF NOT EXISTS partner_training_courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'platform',
  duration_minutes INTEGER DEFAULT 30,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  thumbnail_url TEXT,
  content_url TEXT,
  tier_required VARCHAR(20) DEFAULT 'registered',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training progress tracking
CREATE TABLE IF NOT EXISTS partner_training_progress (
  id SERIAL PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES partner_training_courses(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started',
  progress_pct INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, course_id)
);

-- Seed training courses
INSERT INTO partner_training_courses (title, description, category, duration_minutes, difficulty, content_url, tier_required, sort_order) VALUES
('Partner Portal Walkthrough', 'Complete tour of the Dogan Consult partner portal — dashboard, leads, commissions, and settings.', 'platform', 15, 'beginner', NULL, 'registered', 1),
('Submitting Your First Lead', 'Step-by-step guide to submitting a qualified lead through the portal.', 'platform', 10, 'beginner', NULL, 'registered', 2),
('Understanding the Pipeline', 'Learn how leads move through Discovery → Proposal → Negotiation → Won stages.', 'platform', 20, 'beginner', NULL, 'registered', 3),
('Commission Structure & Payouts', 'How commissions are calculated, approved, and paid. Understand tier-based rates.', 'platform', 15, 'beginner', NULL, 'registered', 4),
('Effective Lead Qualification', 'Techniques to identify and qualify high-value ICT consulting leads in the KSA market.', 'sales', 30, 'intermediate', NULL, 'registered', 5),
('Selling Dogan Consult Services', 'Overview of our service portfolio — Network, Security, Cloud, ERP, GRC — and how to position them.', 'sales', 25, 'intermediate', NULL, 'silver', 6),
('Handling Client Objections', 'Common objections in ICT consulting sales and proven responses.', 'sales', 20, 'intermediate', NULL, 'silver', 7),
('Enterprise Deal Strategy', 'Navigating complex enterprise sales cycles, multiple stakeholders, and procurement processes.', 'sales', 45, 'advanced', NULL, 'gold', 8),
('Network & Data Center Solutions', 'Technical deep-dive into our network infrastructure and data center services.', 'technical', 40, 'intermediate', NULL, 'silver', 9),
('Cybersecurity Service Portfolio', 'Understanding our cybersecurity offerings — SOC, penetration testing, compliance assessments.', 'technical', 35, 'intermediate', NULL, 'silver', 10),
('Cloud & DevOps Solutions', 'Our cloud migration, multi-cloud strategy, and DevOps enablement services.', 'technical', 30, 'intermediate', NULL, 'silver', 11),
('KSA Regulatory Landscape', 'Overview of CITC, NCA, SAMA, and other regulatory bodies relevant to ICT in Saudi Arabia.', 'compliance', 30, 'beginner', NULL, 'registered', 12),
('Data Protection & Privacy (PDPL)', 'Saudi Arabia Personal Data Protection Law — what partners need to know.', 'compliance', 25, 'intermediate', NULL, 'silver', 13),
('NCA Cybersecurity Compliance', 'National Cybersecurity Authority frameworks and how our services address them.', 'compliance', 35, 'advanced', NULL, 'gold', 14),
('Partner Tier Advancement', 'Strategies to advance from Registered to Silver, Gold, and Platinum tiers.', 'platform', 15, 'beginner', NULL, 'registered', 15)
ON CONFLICT DO NOTHING;

-- Seed partner resources library
INSERT INTO partner_resources (title, description, category, url, file_type, tier_required, is_active, sort_order) VALUES
('Partner Program Guide', 'Complete overview of the Dogan Consult Partner Lead Referral Program — tiers, commissions, SLAs.', 'guides', '/assets/resources/partner-program-guide.pdf', 'pdf', 'registered', TRUE, 1),
('Lead Submission Best Practices', 'Tips for submitting high-quality leads that convert faster.', 'guides', '/assets/resources/lead-submission-guide.pdf', 'pdf', 'registered', TRUE, 2),
('Service Portfolio Overview', 'One-page overview of all Dogan Consult ICT services for client presentations.', 'sales', '/assets/resources/service-portfolio.pdf', 'pdf', 'registered', TRUE, 3),
('Client Pitch Deck Template', 'Professional PowerPoint template for presenting Dogan Consult solutions to prospects.', 'sales', '/assets/resources/pitch-deck-template.pptx', 'pptx', 'silver', TRUE, 4),
('ROI Calculator Spreadsheet', 'Excel template to calculate projected ROI for clients considering our services.', 'sales', '/assets/resources/roi-calculator.xlsx', 'xlsx', 'silver', TRUE, 5),
('Technical Requirements Checklist', 'Checklist for gathering technical requirements from prospective clients.', 'technical', '/assets/resources/tech-requirements-checklist.pdf', 'pdf', 'silver', TRUE, 6),
('Network Assessment Template', 'Template for conducting preliminary network assessments with prospects.', 'technical', '/assets/resources/network-assessment.pdf', 'pdf', 'gold', TRUE, 7),
('Security Audit Questionnaire', 'Pre-engagement security questionnaire for cybersecurity service leads.', 'technical', '/assets/resources/security-questionnaire.pdf', 'pdf', 'gold', TRUE, 8),
('KSA Compliance Quick Reference', 'Summary of key Saudi regulatory requirements for ICT companies.', 'compliance', '/assets/resources/ksa-compliance-guide.pdf', 'pdf', 'registered', TRUE, 9),
('Commission Policy Document', 'Detailed commission structure, payment terms, and dispute resolution procedures.', 'policies', '/assets/resources/commission-policy.pdf', 'pdf', 'registered', TRUE, 10),
('Partner Code of Conduct', 'Ethics and conduct guidelines for Dogan Consult partners.', 'policies', '/assets/resources/partner-code-of-conduct.pdf', 'pdf', 'registered', TRUE, 11),
('NDA Template', 'Non-disclosure agreement template for use with prospective clients.', 'policies', '/assets/resources/nda-template.pdf', 'pdf', 'silver', TRUE, 12),
('Brand Guidelines', 'Dogan Consult brand usage guidelines — logos, colors, and co-branding rules.', 'marketing', '/assets/resources/brand-guidelines.pdf', 'pdf', 'registered', TRUE, 13),
('Co-Marketing Request Form', 'Form to request joint marketing activities with Dogan Consult.', 'marketing', '/assets/resources/co-marketing-form.pdf', 'pdf', 'gold', TRUE, 14),
('Case Study: Enterprise Network Transformation', 'How we delivered a full network overhaul for a Saudi enterprise client.', 'case_studies', '/assets/resources/case-study-network.pdf', 'pdf', 'silver', TRUE, 15),
('Case Study: Cybersecurity for Financial Services', 'SOC implementation and NCA compliance for a leading financial institution.', 'case_studies', '/assets/resources/case-study-security.pdf', 'pdf', 'gold', TRUE, 16)
ON CONFLICT DO NOTHING;
