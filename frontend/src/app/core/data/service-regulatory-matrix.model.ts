/**
 * Service × Country regulatory matrix — for consulting office.
 * Per service (CR activity code) per country: regulators, frameworks, controls, permits, reference documents.
 * Used by: contracts, NDAs, proposals, compliance checklists, code (activity codes designed to reference this).
 */

export interface RegulatorRef {
  id: string;
  nameEn: string;
  nameAr?: string;
  scope: string; // e.g. "National cybersecurity", "Data protection"
}

export interface FrameworkRef {
  id: string;
  nameEn: string;
  nameAr?: string;
  version?: string;
  authority?: string; // regulator id or name
}

export interface PermitRequirement {
  type: string;       // e.g. "Commercial license", "Sector permit"
  renewal: 'one-off' | 'annual' | 'other';
  authority?: string;
  reference?: string; // law or official link
}

export interface ReferenceDocument {
  name: string;
  type: 'law' | 'framework' | 'standard_terms' | 'nda_template' | 'official_guide' | 'other';
  url?: string;
  path?: string;      // internal path or doc id
}

export interface InDepthNeeds {
  dataResidency?: string[];
  reportingCadence?: string;
  certificationRequired?: string[];
  other?: string;
}

/** One row of the matrix: all regulatory/permit/document info for (activity_code, country). */
export interface ServiceRegulatoryEntry {
  activityCode: string;
  countryCode: string;
  regulators: RegulatorRef[];
  frameworks: FrameworkRef[];
  controlThemes: string[];   // e.g. ["IAM", "Data protection", "Logging"]
  permits: PermitRequirement[];
  referenceDocuments: ReferenceDocument[];
  inDepthNeeds?: InDepthNeeds;
}

/** Matrix key: activity_code -> country -> entry. */
export type ServiceRegulatoryMatrix = Record<string, Record<string, ServiceRegulatoryEntry>>;

/** Get entry for (activityCode, countryCode). */
export function getServiceRegulatoryEntry(
  matrix: ServiceRegulatoryMatrix,
  activityCode: string,
  countryCode: string
): ServiceRegulatoryEntry | undefined {
  return matrix[activityCode]?.[countryCode];
}
