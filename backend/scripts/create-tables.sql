-- Dogan Consult ICT Platform Database Schema
-- Production Database Initialization Script

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'partner', 'customer', 'staff', 'employee')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    access_failed_count INT DEFAULT 0,
    lockout_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads table (main lead tracking)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE,
    company_name VARCHAR(255),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_title VARCHAR(100),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    product_line VARCHAR(100),
    service_interest TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    description TEXT,
    requirements TEXT,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(50) DEFAULT 'website',
    source_details JSONB,
    campaign VARCHAR(100),
    referrer VARCHAR(255),
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    partner_id UUID REFERENCES users(id),
    is_partner_lead BOOLEAN DEFAULT false,
    commission_percentage DECIMAL(5,2),
    tags TEXT[],
    notes TEXT,
    internal_notes TEXT,
    first_contact_date TIMESTAMP,
    last_contact_date TIMESTAMP,
    closed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Partner Leads table
CREATE TABLE IF NOT EXISTS partner_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES users(id),
    lead_id UUID NOT NULL REFERENCES leads(id),
    registration_number VARCHAR(50) UNIQUE,
    submission_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'submitted',
    approval_date TIMESTAMP,
    rejection_reason TEXT,
    exclusivity_start_date DATE,
    exclusivity_end_date DATE,
    is_exclusive BOOLEAN DEFAULT false,
    commission_percentage DECIMAL(5,2) DEFAULT 10.00,
    commission_tier VARCHAR(20),
    estimated_commission DECIMAL(12,2),
    actual_commission DECIMAL(12,2),
    commission_status VARCHAR(50) DEFAULT 'pending',
    partner_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(partner_id, lead_id)
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id),
    opportunity_number VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    deal_stage VARCHAR(50) DEFAULT 'qualification',
    probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
    estimated_value DECIMAL(12,2),
    actual_value DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'SAR',
    margin_percentage DECIMAL(5,2),
    expected_close_date DATE,
    actual_close_date DATE,
    project_start_date DATE,
    project_end_date DATE,
    competitors TEXT[],
    competitive_position VARCHAR(50),
    win_loss_reason TEXT,
    owner_id UUID REFERENCES users(id),
    team_members UUID[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Engagements table
CREATE TABLE IF NOT EXISTS engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    opportunity_id UUID REFERENCES opportunities(id),
    engagement_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    outcome VARCHAR(100),
    next_steps TEXT,
    owner_id UUID REFERENCES users(id),
    participants JSONB,
    scheduled_date TIMESTAMP,
    actual_date TIMESTAMP,
    duration_minutes INTEGER,
    location VARCHAR(255),
    meeting_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gates table
CREATE TABLE IF NOT EXISTS gates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    gate_type VARCHAR(50) NOT NULL,
    gate_name VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    decision VARCHAR(50),
    decision_date TIMESTAMP,
    approver_id UUID REFERENCES users(id),
    approval_notes TEXT,
    conditions TEXT,
    required_documents TEXT[],
    submitted_documents JSONB,
    evidence_links TEXT[],
    compliance_checks JSONB,
    risk_assessment JSONB,
    due_date TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES users(id),
    lead_id UUID REFERENCES leads(id),
    opportunity_id UUID REFERENCES opportunities(id),
    commission_type VARCHAR(50) DEFAULT 'referral',
    calculation_basis VARCHAR(50) DEFAULT 'percentage',
    base_amount DECIMAL(12,2),
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    status VARCHAR(50) DEFAULT 'pending',
    approval_date TIMESTAMP,
    payment_date TIMESTAMP,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    invoice_number VARCHAR(50),
    calculation_notes TEXT,
    payment_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    category VARCHAR(50),
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    access_level VARCHAR(50) DEFAULT 'private',
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Inquiries table (DLI)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    product_interest VARCHAR(100),
    urgency VARCHAR(20),
    consent_marketing BOOLEAN DEFAULT false,
    consent_data_processing BOOLEAN DEFAULT false,
    is_processed BOOLEAN DEFAULT false,
    processed_date TIMESTAMP,
    lead_id UUID REFERENCES leads(id),
    source_page VARCHAR(255),
    referrer VARCHAR(500),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create all indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_id ON partner_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_engagements_lead_id ON engagements(lead_id);
CREATE INDEX IF NOT EXISTS idx_gates_entity ON gates(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_leads_updated_at BEFORE UPDATE ON partner_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO doganconsult;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO doganconsult;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO doganconsult;