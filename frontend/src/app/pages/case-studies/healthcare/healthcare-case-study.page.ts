/**
 * Healthcare Case Study Page
 * KSA-aligned healthcare modernization with reference-backed claims
 * All metrics are normalized indices (0-100) to avoid sensitive data exposure
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferencesComponent } from '../../../components/case-studies/references.component';
import { KpiBulletChartComponent } from '../../../components/charts/kpi-bullet-chart.component';
import { DeliveryTimelineComponent } from '../../../components/charts/delivery-timeline.component';
import { ArchitectureMapComponent } from '../../../components/charts/architecture-map.component';
import { CaseStudyService, Reference, CaseStudyMetrics, TimelinePhase } from '../../../services/case-study.service';

@Component({
  selector: 'app-healthcare-case-study',
  standalone: true,
  imports: [
    CommonModule,
    ReferencesComponent,
    KpiBulletChartComponent,
    DeliveryTimelineComponent,
    ArchitectureMapComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-th-bg-alt to-th-card">
      <!-- Header -->
      <header class="bg-th-card border-b">
        <div class="container mx-auto px-6 py-8">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-th-text-2 mb-6">
            <a href="/success-stories" class="hover:text-blue-600 transition-colors">Success Stories</a>
            <span>/</span>
            <span class="font-medium">Healthcare</span>
          </nav>

          <div class="max-w-4xl">
            <h1 class="text-display-3 font-bold text-th-text mb-4">
              Healthcare Modernization Program
            </h1>
            <p class="text-h5 text-th-text-2 mb-2">
              KSA-aligned Interoperability & Cloud Governance
            </p>
            <p class="text-body-lg text-th-text-2 leading-relaxed">
              A comprehensive modernization blueprint focused on standards-based interoperability and
              policy-aligned data exchange — grounded in <strong>nphies FHIR R4</strong><sup>[1]</sup> and
              <strong>SeHE policies</strong><sup>[2]</sup>, with privacy obligations aligned to
              <strong>PDPL</strong><sup>[3]</sup> and cybersecurity governance mapped to
              <strong>NCA ECC</strong><sup>[4]</sup>.
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-6">
              <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                HL7 FHIR R4
              </span>
              <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                HIE / Interoperability
              </span>
              <span class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                Cloud Governance (KSA)
              </span>
              <span class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                Privacy & Security Controls
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-6 py-12">
        <!-- Challenge, Approach, Deliverables -->
        <section class="grid lg:grid-cols-3 gap-6 mb-12">
          <!-- Challenge -->
          <div class="bg-th-card rounded-xl border border-th-border p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 class="text-h4 font-semibold text-th-text">Challenge</h2>
            </div>
            <ul class="space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-th-text-3 mt-1">•</span>
                <span class="text-th-text-2">Fragmented clinical and administrative systems with inconsistent data exchange</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-th-text-3 mt-1">•</span>
                <span class="text-th-text-2">Interoperability needed to align with KSA national payer/provider exchange direction</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-th-text-3 mt-1">•</span>
                <span class="text-th-text-2">Cloud adoption required explicit governance controls and regulatory alignment</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-th-text-3 mt-1">•</span>
                <span class="text-th-text-2">Privacy and security compliance across multiple regulatory frameworks</span>
              </li>
            </ul>
          </div>

          <!-- Approach -->
          <div class="bg-th-card rounded-xl border border-th-border p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-h4 font-semibold text-th-text">Approach</h2>
            </div>
            <ul class="space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-th-text-2">
                  Interoperability layer aligned to <strong>nphies FHIR R4</strong> implementation guidance<sup>[1]</sup>
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-th-text-2">
                  Exchange policies and auditability per <strong>SeHE policies v1.0</strong><sup>[2]</sup>
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-th-text-2">
                  Privacy obligations mapped to <strong>PDPL requirements</strong><sup>[3]</sup>
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-th-text-2">
                  Security governance aligned with <strong>NCA ECC controls</strong><sup>[4]</sup>
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-th-text-2">
                  Cloud strategy per <strong>MCIT Cloud First</strong><sup>[5]</sup> & <strong>CST regulations</strong><sup>[6]</sup>
                </span>
              </li>
            </ul>
          </div>

          <!-- Deliverables -->
          <div class="bg-th-card rounded-xl border border-th-border p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 class="text-h4 font-semibold text-th-text">Deliverables</h2>
            </div>
            <ul class="space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-1">→</span>
                <span class="text-th-text-2">Interoperability blueprint: FHIR profiles, API gateway, routing patterns</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-1">→</span>
                <span class="text-th-text-2">Security & privacy mapping: PDPL + ECC controls, audit logging</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-1">→</span>
                <span class="text-th-text-2">Cloud landing zone: identity, network segmentation, monitoring</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-1">→</span>
                <span class="text-th-text-2">Operational playbooks: integration runbooks, incident response</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-1">→</span>
                <span class="text-th-text-2">Compliance documentation: regulatory mapping matrices</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Solution Architecture Section -->
        <section class="bg-th-card rounded-xl border border-th-border p-8 mb-12">
          <h2 class="text-h3 font-semibold text-th-text mb-4">
            Solution Architecture
          </h2>
          <p class="text-body-lg text-th-text-2 mb-8 max-w-4xl">
            The architecture emphasizes standards-based exchange and controlled cloud governance.
            Interoperability alignment references the KSA nphies FHIR R4 guide<sup>[1]</sup> and SeHE exchange policies<sup>[2]</sup>.
            Privacy and data handling obligations reference PDPL<sup>[3]</sup>.
            Cybersecurity governance references NCA ECC<sup>[4]</sup>.
            Cloud governance references MCIT Cloud First<sup>[5]</sup> and CST regulations<sup>[6]</sup>.
          </p>

          <div class="grid lg:grid-cols-2 gap-6">
            <!-- Architecture Map -->
            <div class="bg-th-bg-alt rounded-lg p-6">
              <h3 class="text-h5 font-semibold text-th-text mb-4">
                Interoperability Architecture Map
              </h3>
              <app-architecture-map
                [nodes]="architectureNodes()"
                [links]="architectureLinks()"
                [height]="320">
              </app-architecture-map>
              <p class="text-caption text-th-text-3 mt-3">
                * Diagram shows reference architecture pattern (no confidential details)
              </p>
            </div>

            <!-- Delivery Timeline -->
            <div class="bg-th-bg-alt rounded-lg p-6">
              <h3 class="text-h5 font-semibold text-th-text mb-4">
                Implementation Timeline
              </h3>
              <app-delivery-timeline
                [phases]="timelinePhases()"
                [height]="320">
              </app-delivery-timeline>
              <p class="text-caption text-th-text-3 mt-3">
                * Generic timeline template for modernization programs
              </p>
            </div>
          </div>
        </section>

        <!-- Outcomes Section -->
        <section class="bg-th-card rounded-xl border border-th-border p-8 mb-12">
          <h2 class="text-h3 font-semibold text-th-text mb-4">
            Outcomes (Normalized Indices)
          </h2>
          <p class="text-body-lg text-th-text-2 mb-8 max-w-4xl">
            Results are visualized as normalized indices (0–100) representing directional improvement
            and operational readiness. These are illustrative templates, not actual client KPIs.
          </p>

          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Access Continuity Index -->
            <div class="bg-gradient-to-br from-blue-50 to-th-card rounded-lg p-6 border border-blue-100">
              <h3 class="text-h5 font-semibold text-th-text mb-4">
                Access Continuity Index
              </h3>
              <app-kpi-bullet-chart
                [baseline]="metrics().accessContinuityIndex.baseline"
                [target]="metrics().accessContinuityIndex.target"
                [actual]="metrics().accessContinuityIndex.actual"
                [label]="'Operational Readiness'"
                [color]="'blue'">
              </app-kpi-bullet-chart>
              <p class="text-caption text-th-text-3 mt-3">
                Derived from operational controls + monitoring readiness mapping
              </p>
            </div>

            <!-- Interoperability Index -->
            <div class="bg-gradient-to-br from-green-50 to-th-card rounded-lg p-6 border border-green-100">
              <h3 class="text-h5 font-semibold text-th-text mb-4">
                Interoperability Index
              </h3>
              <app-kpi-bullet-chart
                [baseline]="metrics().interoperabilityIndex.baseline"
                [target]="metrics().interoperabilityIndex.target"
                [actual]="metrics().interoperabilityIndex.actual"
                [label]="'Standards Alignment'"
                [color]="'green'">
              </app-kpi-bullet-chart>
              <p class="text-caption text-th-text-3 mt-3">
                Aligned to nphies FHIR R4 + SeHE policy requirements<sup>[1,2]</sup>
              </p>
            </div>

            <!-- Analytics Readiness Index -->
            <div class="bg-gradient-to-br from-purple-50 to-th-card rounded-lg p-6 border border-purple-100">
              <h3 class="text-h5 font-semibold text-th-text mb-4">
                Analytics Readiness Index
              </h3>
              <app-kpi-bullet-chart
                [baseline]="metrics().analyticsReadinessIndex.baseline"
                [target]="metrics().analyticsReadinessIndex.target"
                [actual]="metrics().analyticsReadinessIndex.actual"
                [label]="'Data Maturity'"
                [color]="'purple'">
              </app-kpi-bullet-chart>
              <p class="text-caption text-th-text-3 mt-3">
                Represents data standardization + governance maturity
              </p>
            </div>
          </div>
        </section>

        <!-- Technologies Used -->
        <section class="bg-gradient-to-r from-surface-dark to-brand-dark rounded-xl p-8 mb-12 text-white">
          <h2 class="text-h3 font-semibold mb-6">Technologies & Standards</h2>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider mb-3">Interoperability</h4>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>HL7 FHIR R4</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>nphies Profiles</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>IHE Frameworks</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider mb-3">Cloud Platform</h4>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>AWS Healthcare</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Kubernetes</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>API Gateway</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider mb-3">Security</h4>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Zero Trust</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>PKI/HSM</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>SIEM/SOAR</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-th-text-3 uppercase tracking-wider mb-3">Analytics</h4>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Data Lake</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>ML Pipeline</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>BI Dashboards</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- References Section -->
        <section class="bg-th-card rounded-xl border border-th-border p-8">
          <h2 class="text-h3 font-semibold text-th-text mb-4">
            Compliance & Standards References
          </h2>
          <p class="text-body-lg text-th-text-2 mb-8 max-w-4xl">
            The following authoritative sources support all claims made in this case study.
            These references can be used directly in Word documents (APA 7 format) or as footnotes in reports.
          </p>

          <app-references [references]="references()"></app-references>
        </section>

        <!-- CTA Section -->
        <section class="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h2 class="text-h3 font-semibold mb-4">
            Ready to Transform Your Healthcare Infrastructure?
          </h2>
          <p class="text-body-lg mb-6 max-w-2xl mx-auto">
            Our team has deep expertise in KSA healthcare regulations and proven experience
            delivering compliant, scalable solutions.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <button class="px-8 py-3 bg-th-card text-blue-600 rounded-lg font-semibold hover:bg-th-bg-alt transition-colors">
              Schedule Consultation
            </button>
            <button class="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors">
              Download Case Study PDF
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HealthcareCaseStudyPage implements OnInit {
  // Signals for reactive data
  references = signal<Reference[]>([]);
  metrics = signal<CaseStudyMetrics>({
    accessContinuityIndex: { baseline: 55, target: 85, actual: 80 },
    interoperabilityIndex: { baseline: 40, target: 90, actual: 82 },
    analyticsReadinessIndex: { baseline: 35, target: 80, actual: 70 }
  });

  timelinePhases = signal<TimelinePhase[]>([]);
  architectureNodes = signal<any[]>([]);
  architectureLinks = signal<any[]>([]);

  constructor(private caseStudyService: CaseStudyService) {}

  ngOnInit() {
    // Load references
    this.references.set(this.getHealthcareReferences());

    // Set timeline phases
    this.timelinePhases.set([
      { name: 'Discovery & Governance', start: '2024-01', end: '2024-02', color: '#3b82f6' },
      { name: 'Interop Blueprint (FHIR/SeHE)', start: '2024-02', end: '2024-04', color: '#10b981' },
      { name: 'Cloud Landing Zone & Security', start: '2024-04', end: '2024-05', color: '#f59e0b' },
      { name: 'HIE Build + Integration', start: '2024-05', end: '2024-09', color: '#8b5cf6' },
      { name: 'Rollout & Operationalization', start: '2024-09', end: '2024-12', color: '#ef4444' }
    ]);

    // Set architecture nodes and links
    this.architectureNodes.set([
      { id: 'ehr', name: 'Hospital EHRs', x: 100, y: 200, category: 'source' },
      { id: 'hie', name: 'HIE Layer\\n(API Gateway + FHIR)', x: 350, y: 200, category: 'core' },
      { id: 'nphies', name: 'nphies\\n(FHIR R4)', x: 600, y: 100, category: 'external' },
      { id: 'sehe', name: 'SeHE Policy\\n(Audit/Access)', x: 600, y: 300, category: 'policy' },
      { id: 'cloud', name: 'Cloud Platform\\n(AWS/Azure)', x: 350, y: 400, category: 'infrastructure' },
      { id: 'security', name: 'Security Layer\\n(NCA ECC)', x: 100, y: 400, category: 'security' },
      { id: 'analytics', name: 'Analytics Platform', x: 600, y: 200, category: 'analytics' }
    ]);

    this.architectureLinks.set([
      { source: 'ehr', target: 'hie', value: 'Clinical Events' },
      { source: 'hie', target: 'nphies', value: 'Claims/Eligibility' },
      { source: 'hie', target: 'sehe', value: 'Policy Enforcement' },
      { source: 'hie', target: 'analytics', value: 'Standardized Data' },
      { source: 'cloud', target: 'hie', value: 'Runtime Platform' },
      { source: 'security', target: 'cloud', value: 'Security Controls' },
      { source: 'security', target: 'hie', value: 'Access Management' }
    ]);
  }

  private getHealthcareReferences(): Reference[] {
    return [
      {
        id: 'nphies-fhir',
        label: 'CHI nphies FHIR R4 Implementation Guide',
        url: 'https://nphies.sa/implementation-guides',
        publisher: 'Council of Health Insurance (CHI)',
        year: '2024',
        category: 'regulation',
        relevance: 'Defines KSA national standards for healthcare data exchange using HL7 FHIR R4'
      },
      {
        id: 'sehe-policies',
        label: 'Saudi Health Information Exchange (SeHE) Policies v1.0',
        url: 'https://nhic.gov.sa/standards/SeHE-Policies-v1.0.pdf',
        publisher: 'National Health Information Center (NHIC)',
        year: '2023',
        category: 'regulation',
        relevance: 'Establishes security, privacy, auditability, and exchange policy requirements'
      },
      {
        id: 'pdpl',
        label: 'Personal Data Protection Law (PDPL) - English Version',
        url: 'https://sdaia.gov.sa/en/PDPL',
        publisher: 'Saudi Data & AI Authority (SDAIA)',
        year: '2023',
        category: 'law',
        relevance: 'Legal framework for personal data handling and privacy obligations in KSA'
      },
      {
        id: 'nca-ecc',
        label: 'Essential Cybersecurity Controls (ECC-1:2018)',
        url: 'https://nca.gov.sa/ecc',
        publisher: 'National Cybersecurity Authority (NCA)',
        year: '2018',
        category: 'regulation',
        relevance: 'National cybersecurity baseline controls for governance and audit'
      },
      {
        id: 'mcit-cloud',
        label: 'Cloud First Policy',
        url: 'https://www.mcit.gov.sa/en/cloud-first-policy',
        publisher: 'Ministry of Communications and Information Technology (MCIT)',
        year: '2019',
        category: 'policy',
        relevance: 'Government direction for cloud adoption and governance in KSA'
      },
      {
        id: 'cst-cloud-reg',
        label: 'Cloud Computing Services Provisioning Regulations',
        url: 'https://www.cst.gov.sa/en/regulations/cloud-regulations',
        publisher: 'Communications, Space and Technology Commission (CST)',
        year: '2020',
        category: 'regulation',
        relevance: 'Regulatory framework for cloud service provisioning in KSA'
      },
      {
        id: 'ieee-fhir',
        label: 'IEEE 11073 SDC and HL7 FHIR Convergence for Medical Device Integration',
        url: 'https://ieeexplore.ieee.org/document/9149697',
        publisher: 'IEEE',
        year: '2020',
        category: 'research',
        relevance: 'International standards for medical device and clinical data interoperability'
      },
      {
        id: 'himss-maturity',
        label: 'HIMSS Electronic Medical Record Adoption Model (EMRAM)',
        url: 'https://www.himss.org/what-we-do-solutions/digital-health-transformation/maturity-models/electronic-medical-record-adoption-model-emram',
        publisher: 'HIMSS',
        year: '2023',
        category: 'framework',
        relevance: 'Global framework for assessing healthcare IT maturity levels'
      }
    ];
  }
}