-- Fix existing schema issues
-- Drop conflicting tables and recreate with proper structure

-- First, drop dependent objects
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS engagements CASCADE;
DROP TABLE IF EXISTS gates CASCADE;
DROP TABLE IF EXISTS commissions CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS partner_leads CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;

-- Keep the simple leads table for backward compatibility
-- But add missing columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ticket_number VARCHAR(20) UNIQUE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_line VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_interest TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update existing data
UPDATE leads SET
  contact_name = COALESCE(name, 'Unknown'),
  contact_email = email,
  company_name = COALESCE(company, 'Unknown'),
  ticket_number = 'TKT-' || LPAD(id::text, 6, '0')
WHERE contact_name IS NULL;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create partner_leads with integer references
CREATE TABLE IF NOT EXISTS partner_leads (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES users(id),
    lead_id INTEGER REFERENCES leads(id),
    registration_number VARCHAR(50) UNIQUE,
    submission_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'submitted',
    commission_percentage DECIMAL(5,2) DEFAULT 10.00,
    partner_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(partner_id, lead_id)
);

-- Create opportunities with integer references
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    opportunity_number VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deal_stage VARCHAR(50) DEFAULT 'qualification',
    probability INTEGER DEFAULT 10,
    estimated_value DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'SAR',
    expected_close_date DATE,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create engagements with integer references
CREATE TABLE IF NOT EXISTS engagements (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    engagement_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    owner_id INTEGER REFERENCES users(id),
    scheduled_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create gates with varchar entity_id to handle both
CREATE TABLE IF NOT EXISTS gates (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    gate_type VARCHAR(50) NOT NULL,
    gate_name VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    approver_id INTEGER REFERENCES users(id),
    approval_notes TEXT,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create commissions with integer references
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES users(id),
    lead_id INTEGER REFERENCES leads(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    commission_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create files with varchar entity_id
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create inquiries with integer reference
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    inquiry_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    product_interest VARCHAR(100),
    is_processed BOOLEAN DEFAULT false,
    lead_id INTEGER REFERENCES leads(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Insert default admin user (password will be hashed by the application)
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('admin@doganconsult.com', '$2a$10$dummyhash', 'System Admin', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO doganconsult;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO doganconsult;