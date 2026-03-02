-- SBG Consultations table for Saudi Business Gate consultation requests
CREATE TABLE IF NOT EXISTS sbg_consultations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  phone VARCHAR(50),
  objective VARCHAR(100),
  systems TEXT,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  source VARCHAR(50) DEFAULT 'sbg-website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sbg_consultations_email ON sbg_consultations(email);
CREATE INDEX IF NOT EXISTS idx_sbg_consultations_status ON sbg_consultations(status);
CREATE INDEX IF NOT EXISTS idx_sbg_consultations_created ON sbg_consultations(created_at DESC);
