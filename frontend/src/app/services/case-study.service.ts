/**
 * Case Study Service
 * Manages case study data, references, and metrics
 * Provides KSA-compliant reference data
 */

import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

// Data Models
export interface Reference {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  year?: string;
  category: 'regulation' | 'law' | 'policy' | 'research' | 'framework' | 'standard';
  relevance?: string;
  tags?: string[];
}

export interface CaseStudyMetricItem {
  baseline: number;  // 0-100
  target: number;    // 0-100
  actual: number;    // 0-100
}

export interface CaseStudyMetrics {
  accessContinuityIndex: CaseStudyMetricItem;
  interoperabilityIndex: CaseStudyMetricItem;
  analyticsReadinessIndex: CaseStudyMetricItem;
  [key: string]: CaseStudyMetricItem;
}

export interface TimelinePhase {
  name: string;
  start: string;  // Date string (YYYY-MM or YYYY-MM-DD)
  end: string;    // Date string
  color?: string;
  description?: string;
  deliverables?: string[];
}

export interface CaseStudyData {
  id: string;
  title: string;
  client: string;
  industry: 'healthcare' | 'finance' | 'government' | 'energy' | 'retail' | 'education';
  challenge: string[];
  approach: string[];
  deliverables: string[];
  technologies: string[];
  metrics: CaseStudyMetrics;
  timeline: TimelinePhase[];
  references: Reference[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CaseStudyService {
  private caseStudies$ = new BehaviorSubject<CaseStudyData[]>([]);

  // KSA Healthcare References Database
  private healthcareReferences: Reference[] = [
    {
      id: 'nphies-fhir',
      label: 'CHI nphies Healthcare Services HL7 FHIR R4 Implementation Guide',
      url: 'https://nphies.sa/implementation-guides',
      publisher: 'Council of Health Insurance',
      year: '2024',
      category: 'regulation',
      relevance: 'Defines KSA national standards for healthcare data exchange using HL7 FHIR R4',
      tags: ['FHIR', 'interoperability', 'nphies']
    },
    {
      id: 'sehe-policies',
      label: 'Saudi Health Information Exchange (SeHE) Policies and Standards',
      url: 'https://nhic.gov.sa/standards/SeHE',
      publisher: 'National Health Information Center',
      year: '2023',
      category: 'regulation',
      relevance: 'Establishes security, privacy, and exchange requirements for health data',
      tags: ['HIE', 'privacy', 'security']
    },
    {
      id: 'pdpl',
      label: 'Personal Data Protection Law (PDPL)',
      url: 'https://sdaia.gov.sa/en/PDPL',
      publisher: 'Saudi Data & AI Authority',
      year: '2023',
      category: 'law',
      relevance: 'Legal framework for personal data protection in KSA',
      tags: ['privacy', 'compliance', 'data protection']
    },
    {
      id: 'nca-ecc',
      label: 'Essential Cybersecurity Controls (ECC-1:2018)',
      url: 'https://nca.gov.sa/ecc',
      publisher: 'National Cybersecurity Authority',
      year: '2018',
      category: 'regulation',
      relevance: 'National cybersecurity baseline for all organizations',
      tags: ['security', 'compliance', 'controls']
    },
    {
      id: 'moh-standards',
      label: 'MOH Digital Health Standards and Guidelines',
      url: 'https://www.moh.gov.sa/en/Ministry/eheath',
      publisher: 'Ministry of Health',
      year: '2023',
      category: 'policy',
      relevance: 'MOH-specific digital health transformation standards',
      tags: ['digital health', 'MOH', 'transformation']
    },
    {
      id: 'himss-emram',
      label: 'HIMSS Electronic Medical Record Adoption Model',
      url: 'https://www.himss.org/emram',
      publisher: 'HIMSS',
      year: '2023',
      category: 'framework',
      relevance: 'International framework for healthcare IT maturity assessment',
      tags: ['HIMSS', 'maturity', 'EMR']
    }
  ];

  // KSA Finance References Database
  private financeReferences: Reference[] = [
    {
      id: 'sama-csf',
      label: 'SAMA Cybersecurity Framework',
      url: 'https://www.sama.gov.sa/en-US/Laws/BankingRules',
      publisher: 'Saudi Central Bank',
      year: '2020',
      category: 'regulation',
      relevance: 'Mandatory cybersecurity requirements for financial institutions',
      tags: ['SAMA', 'cybersecurity', 'banking']
    },
    {
      id: 'sama-bcm',
      label: 'Business Continuity Management Framework',
      url: 'https://www.sama.gov.sa/en-US/Laws',
      publisher: 'Saudi Central Bank',
      year: '2021',
      category: 'regulation',
      relevance: 'Business continuity requirements for financial sector',
      tags: ['BCM', 'resilience', 'SAMA']
    },
    {
      id: 'sama-cloud',
      label: 'Cloud Computing Guidelines for Financial Institutions',
      url: 'https://www.sama.gov.sa/en-US',
      publisher: 'Saudi Central Bank',
      year: '2022',
      category: 'policy',
      relevance: 'Cloud adoption guidelines for banks and financial services',
      tags: ['cloud', 'fintech', 'SAMA']
    }
  ];

  // KSA Government References Database
  private governmentReferences: Reference[] = [
    {
      id: 'dga-policy',
      label: 'Digital Government Authority Policy Framework',
      url: 'https://dga.gov.sa/en/policies',
      publisher: 'Digital Government Authority',
      year: '2023',
      category: 'policy',
      relevance: 'Digital transformation framework for government entities',
      tags: ['DGA', 'digital government', 'transformation']
    },
    {
      id: 'mcit-cloud-first',
      label: 'Cloud First Policy',
      url: 'https://www.mcit.gov.sa/en/cloud-first-policy',
      publisher: 'Ministry of Communications and Information Technology',
      year: '2019',
      category: 'policy',
      relevance: 'Mandates cloud-first approach for government systems',
      tags: ['cloud', 'MCIT', 'policy']
    },
    {
      id: 'nca-ccc',
      label: 'Cloud Cybersecurity Controls (CCC)',
      url: 'https://nca.gov.sa/ccc',
      publisher: 'National Cybersecurity Authority',
      year: '2020',
      category: 'regulation',
      relevance: 'Security controls for government cloud services',
      tags: ['cloud security', 'NCA', 'controls']
    }
  ];

  // KSA Energy References Database
  private energyReferences: Reference[] = [
    {
      id: 'aramco-digital',
      label: 'Saudi Aramco Digital Transformation Strategy',
      url: 'https://www.aramco.com/en/creating-value/technology-development/digitalization',
      publisher: 'Saudi Aramco',
      year: '2023',
      category: 'framework',
      relevance: 'Digital transformation approach for energy sector',
      tags: ['Aramco', 'digital', 'IoT']
    },
    {
      id: 'neom-energy',
      label: 'NEOM Green Hydrogen and Renewable Energy Framework',
      url: 'https://www.neom.com/en-us/sectors/energy',
      publisher: 'NEOM',
      year: '2023',
      category: 'framework',
      relevance: 'Next-generation energy infrastructure standards',
      tags: ['NEOM', 'renewable', 'hydrogen']
    }
  ];

  // IEEE and Research References
  private researchReferences: Reference[] = [
    {
      id: 'ieee-fhir-sdc',
      label: 'IEEE 11073 SDC and HL7 FHIR Convergence for Medical Device Integration',
      url: 'https://ieeexplore.ieee.org/document/9149697',
      publisher: 'IEEE',
      year: '2020',
      category: 'research',
      relevance: 'Standards convergence for medical device interoperability',
      tags: ['IEEE', 'FHIR', 'medical devices']
    },
    {
      id: 'ksa-digital-health',
      label: 'Digital Health Transformation Readiness in Saudi Arabia: A Systematic Review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35969443',
      publisher: 'Journal of Medical Internet Research',
      year: '2022',
      category: 'research',
      relevance: 'Academic assessment of KSA digital health readiness',
      tags: ['research', 'digital health', 'KSA']
    },
    {
      id: 'blockchain-healthcare',
      label: 'Blockchain Technology in Healthcare: A Systematic Review',
      url: 'https://www.mdpi.com/2227-9032/10/1/56',
      publisher: 'Healthcare Journal',
      year: '2022',
      category: 'research',
      relevance: 'Blockchain applications in healthcare systems',
      tags: ['blockchain', 'healthcare', 'research']
    }
  ];

  constructor(private http: HttpClient) {
    this.initializeCaseStudies();
  }

  private initializeCaseStudies() {
    const caseStudies: CaseStudyData[] = [
      {
        id: 'moh-interoperability',
        title: 'Healthcare Interoperability Platform',
        client: 'Ministry of Health',
        industry: 'healthcare',
        challenge: [
          'Fragmented systems across 300+ healthcare facilities',
          'Inconsistent data standards hindering exchange',
          'Need for real-time clinical decision support',
          'Compliance with multiple regulatory frameworks'
        ],
        approach: [
          'Implemented nphies FHIR R4 compliant integration layer',
          'Deployed SeHE-aligned security and privacy controls',
          'Built cloud-native microservices architecture',
          'Established unified data governance framework'
        ],
        deliverables: [
          'FHIR-based interoperability platform',
          'API gateway with 99.99% availability',
          'Real-time analytics dashboard',
          'Comprehensive compliance documentation'
        ],
        technologies: ['HL7 FHIR R4', 'AWS HealthLake', 'Kubernetes', 'Apache Kafka', 'ElasticSearch'],
        metrics: {
          accessContinuityIndex: { baseline: 55, target: 85, actual: 80 },
          interoperabilityIndex: { baseline: 40, target: 90, actual: 82 },
          analyticsReadinessIndex: { baseline: 35, target: 80, actual: 70 }
        },
        timeline: [
          {
            name: 'Discovery & Assessment',
            start: '2024-01',
            end: '2024-02',
            color: '#3b82f6',
            description: 'Current state analysis and requirements gathering'
          },
          {
            name: 'Architecture Design',
            start: '2024-02',
            end: '2024-04',
            color: '#10b981',
            description: 'FHIR profiles and integration blueprint'
          },
          {
            name: 'Platform Development',
            start: '2024-04',
            end: '2024-08',
            color: '#f59e0b',
            description: 'Core platform build and testing'
          },
          {
            name: 'Pilot & Rollout',
            start: '2024-08',
            end: '2024-12',
            color: '#8b5cf6',
            description: 'Phased deployment across facilities'
          }
        ],
        references: this.healthcareReferences
      }
    ];

    this.caseStudies$.next(caseStudies);
  }

  // Public Methods
  getCaseStudies(): Observable<CaseStudyData[]> {
    return this.caseStudies$.asObservable();
  }

  getCaseStudyById(id: string): Observable<CaseStudyData | undefined> {
    return this.caseStudies$.pipe(
      map(studies => studies.find(s => s.id === id))
    );
  }

  getCaseStudiesByIndustry(industry: string): Observable<CaseStudyData[]> {
    return this.caseStudies$.pipe(
      map(studies => studies.filter(s => s.industry === industry))
    );
  }

  getReferences(category?: string): Reference[] {
    const allReferences = [
      ...this.healthcareReferences,
      ...this.financeReferences,
      ...this.governmentReferences,
      ...this.energyReferences,
      ...this.researchReferences
    ];

    if (category) {
      return allReferences.filter(ref => ref.category === category);
    }

    return allReferences;
  }

  getHealthcareReferences(): Reference[] {
    return this.healthcareReferences;
  }

  getFinanceReferences(): Reference[] {
    return this.financeReferences;
  }

  getGovernmentReferences(): Reference[] {
    return this.governmentReferences;
  }

  getEnergyReferences(): Reference[] {
    return this.energyReferences;
  }

  getResearchReferences(): Reference[] {
    return this.researchReferences;
  }

  searchReferences(query: string): Reference[] {
    const lowerQuery = query.toLowerCase();
    return this.getReferences().filter(ref =>
      ref.label.toLowerCase().includes(lowerQuery) ||
      ref.publisher?.toLowerCase().includes(lowerQuery) ||
      ref.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Format references for export
  exportReferencesAsAPA(references: Reference[]): string {
    return references.map(ref => {
      const publisher = ref.publisher || 'n.p.';
      const year = ref.year || 'n.d.';
      return `${publisher}. (${year}). ${ref.label}. Retrieved from ${ref.url}`;
    }).join('\n\n');
  }

  exportReferencesAsIEEE(references: Reference[]): string {
    return references.map((ref, index) => {
      const publisher = ref.publisher || '';
      const year = ref.year || '';
      return `[${index + 1}] ${publisher}, "${ref.label}," ${year}. [Online]. Available: ${ref.url}`;
    }).join('\n\n');
  }

  exportReferencesAsBibTeX(references: Reference[]): string {
    return references.map((ref, index) => {
      const type = ref.category === 'research' ? '@article' : '@misc';
      const key = ref.id || `ref${index + 1}`;

      return `${type}{${key},
  title={${ref.label}},
  author={${ref.publisher || ''}},
  year={${ref.year || ''}},
  url={${ref.url}},
  note={${ref.relevance || ''}}
}`;
    }).join('\n\n');
  }

  // Generate Word-compatible reference list
  generateWordReferenceList(references: Reference[], format: 'apa' | 'ieee' | 'chicago' = 'apa'): Blob {
    let content = '';

    switch (format) {
      case 'apa':
        content = this.exportReferencesAsAPA(references);
        break;
      case 'ieee':
        content = this.exportReferencesAsIEEE(references);
        break;
      default:
        content = this.exportReferencesAsAPA(references);
    }

    // Add header
    const header = `References\n${'='.repeat(50)}\n\n`;
    const footer = `\n\n${'='.repeat(50)}\nGenerated by DoganConsult ICT Platform\n${new Date().toLocaleString()}`;

    const fullContent = header + content + footer;

    return new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  }
}