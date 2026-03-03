import { Component, signal, computed, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { GUIDANCE_TYPE_COLORS, ARCH_LAYER_COLORS } from '../core/data/page-styles';

@Component({
  selector: 'app-services-detailed',
  standalone: true,
  imports: [],
  template: `
    <section class="py-20 lg:py-24 px-6 lg:px-8 bg-th-card" id="services">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-wrap gap-2 mb-10">
          <button (click)="selectedCategory.set('all')"
                  class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all border"
                  [class.bg-primary]="selectedCategory() === 'all'"
                  [class.text-white]="selectedCategory() === 'all'"
                  [class.border-primary]="selectedCategory() === 'all'"
                  [class.shadow-sm]="selectedCategory() === 'all'"
                  [class.bg-th-card]="selectedCategory() !== 'all'"
                  [class.text-th-text-3]="selectedCategory() !== 'all'"
                  [class.border-th-border]="selectedCategory() !== 'all'"
                  [class.hover:border-primary]="selectedCategory() !== 'all'"
                  [class.hover:text-th-text]="selectedCategory() !== 'all'">
                {{ i18n.t('All Services', 'جميع الخدمات') }}
                <span class="ml-1 text-[11px] opacity-60">(17)</span>
          </button>
          @for (cat of categories; track cat.id) {
            <button (click)="selectedCategory.set(cat.id)"
                    class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all border"
                    [class.bg-primary]="selectedCategory() === cat.id"
                    [class.text-white]="selectedCategory() === cat.id"
                    [class.border-primary]="selectedCategory() === cat.id"
                    [class.shadow-sm]="selectedCategory() === cat.id"
                    [class.bg-th-card]="selectedCategory() !== cat.id"
                    [class.text-th-text-3]="selectedCategory() !== cat.id"
                    [class.border-th-border]="selectedCategory() !== cat.id"
                    [class.hover:border-primary]="selectedCategory() !== cat.id"
                    [class.hover:text-th-text]="selectedCategory() !== cat.id">
              {{ cat.name }}
              <span class="ml-1 text-[11px] opacity-60">({{ cat.count }})</span>
            </button>
          }
        </div>

        <div class="grid lg:grid-cols-2 gap-4">
          @for (service of filteredServices(); track service.id) {
            <div class="border border-th-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                 [class.lg:col-span-2]="expandedService() === service.id"
                 (click)="expandedService.set(expandedService() === service.id ? null : service.id)">
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg class="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path [attr.d]="iconPaths[service.id]" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-th-text">{{ service.name }}</h3>
                      <p class="text-[13px] text-th-text-3">{{ service.arabic }}</p>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-th-text-3 transition-transform shrink-0 mt-1"
                       [class.rotate-180]="expandedService() === service.id"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p class="text-sm text-th-text-3 leading-relaxed mb-3">{{ service.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (feature of service.features; track feature) {
                    <span class="px-2.5 py-1 bg-th-bg-alt text-th-text-2 rounded-md text-[11px] font-medium">{{ feature }}</span>
                  }
                </div>

                @if (expandedService() === service.id) {
                  <div class="mt-6 pt-6 border-t border-th-border-lt space-y-6" (click)="$event.stopPropagation()">

                    <div class="grid md:grid-cols-2 gap-6">
                      <div>
                        <p class="text-[11px] font-semibold text-th-text-3 tracking-widest uppercase mb-3 flex items-center gap-1.5">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" /></svg>
                          {{ i18n.t('Consultant Guidance', 'إرشادات استشارية') }}
                        </p>
                        <div class="space-y-2">
                          @for (g of guidanceTracks[service.id]; track g.tip) {
                            <div class="flex items-start gap-2.5 p-3 rounded-lg" [class]="guidanceColors[g.type].bg">
                              <div class="w-7 h-7 rounded-md flex items-center justify-center shrink-0" [class]="guidanceColors[g.type].iconBg">
                                <svg class="w-3.5 h-3.5" [class]="guidanceColors[g.type].iconText" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" [attr.d]="guidanceIconPaths[g.type]" /></svg>
                              </div>
                              <div class="min-w-0">
                                <p class="text-xs font-medium" [class]="guidanceColors[g.type].tipText">{{ g.tip }}</p>
                                <p class="text-[11px] mt-0.5" [class]="guidanceColors[g.type].impactText">{{ g.impact }}</p>
                              </div>
                            </div>
                          }
                        </div>
                      </div>

                      <div>
                        <p class="text-[11px] font-semibold text-th-text-3 tracking-widest uppercase mb-3 flex items-center gap-1.5">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" /></svg>
                          {{ i18n.t('Architecture Layers', 'طبقات البنية') }}
                        </p>
                        <div class="space-y-1.5">
                          @for (layer of archLayers[service.id]; track layer.name; let i = $index) {
                            <div class="relative group/layer">
                              <div class="flex items-center gap-2.5 p-2.5 rounded-lg border border-th-border-lt bg-th-card hover:border-primary/30 hover:shadow-sm transition-all">
                                <div class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                                     [class]="archColors[Math.min(i, 3)]">
                                  L{{ i + 1 }}
                                </div>
                                <div class="min-w-0 flex-1">
                                  <p class="text-xs font-semibold text-th-text">{{ layer.name }}</p>
                                  <div class="flex flex-wrap gap-1 mt-1">
                                    @for (tool of layer.tools; track tool) {
                                      <span class="px-1.5 py-0.5 bg-th-bg-alt text-th-text-3 rounded text-[10px]">{{ tool }}</span>
                                    }
                                  </div>
                                </div>
                              </div>
                              @if (i < archLayers[service.id].length - 1) {
                                <div class="flex justify-center">
                                  <div class="w-px h-3 bg-th-bg-tert"></div>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    <div>
                      <p class="text-[11px] font-semibold text-th-text-3 tracking-widest uppercase mb-3 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
                        {{ i18n.t('Engagement Roadmap', 'خارطة الطريق') }}
                      </p>
                      <div class="flex flex-col md:flex-row gap-0">
                        @for (d of service.deliverables; track d; let i = $index; let last = $last) {
                          <div class="flex md:flex-col items-start md:items-center gap-2 md:gap-0 flex-1 relative">
                            <div class="flex flex-col md:flex-row items-center w-full">
                              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 border-2"
                                   [class]="i === 0 ? 'bg-primary text-white border-primary' : 'bg-th-card text-th-text-3 border-th-border'">
                                {{ i + 1 }}
                              </div>
                              @if (!last) {
                                <div class="hidden md:block flex-1 h-px bg-th-bg-tert w-full"></div>
                                <div class="md:hidden w-px h-4 bg-th-bg-tert ml-[15px]"></div>
                              }
                            </div>
                            <p class="text-[11px] text-th-text-2 md:text-center md:mt-2 md:px-1 leading-tight">{{ d }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                      <div class="bg-gradient-to-br from-th-bg-alt to-th-bg-tert/50 rounded-xl p-4 text-center border border-th-border-lt">
                        <div class="text-xl font-bold text-th-text">{{ service.metric1.value }}</div>
                        <div class="text-[11px] text-th-text-3 mt-0.5">{{ service.metric1.label }}</div>
                      </div>
                      <div class="bg-gradient-to-br from-th-bg-alt to-th-bg-tert/50 rounded-xl p-4 text-center border border-th-border-lt">
                        <div class="text-xl font-bold text-th-text">{{ service.metric2.value }}</div>
                        <div class="text-[11px] text-th-text-3 mt-0.5">{{ service.metric2.label }}</div>
                      </div>
                      <div class="bg-gradient-to-br from-th-bg-alt to-th-bg-tert/50 rounded-xl p-4 text-center border border-th-border-lt">
                        <div class="text-xl font-bold text-th-text">{{ service.metric3.value }}</div>
                        <div class="text-[11px] text-th-text-3 mt-0.5">{{ service.metric3.label }}</div>
                      </div>
                    </div>

                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="mt-12 flex items-center gap-3 px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
          <span class="font-medium">{{ i18n.t('All services Saudi Government licensed — CR #7008903317', 'جميع الخدمات مرخصة من الحكومة السعودية — سجل تجاري #7008903317') }}</span>
        </div>
      </div>
    </section>
  `,
})
export class ServicesDetailedComponent {
  i18n = inject(I18nService);
  selectedCategory = signal('all');
  expandedService = signal<string | null>(null);
  Math = Math;
  guidanceColors = GUIDANCE_TYPE_COLORS;
  archColors = ARCH_LAYER_COLORS;
  guidanceIconPaths: Record<string, string> = {
    cost: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
    efficiency: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
    risk: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  };

  readonly guidanceTracks: Record<string, { type: 'cost' | 'efficiency' | 'risk'; tip: string; impact: string }[]> = {
    'network': [
      { type: 'cost', tip: 'Consolidate multi-vendor contracts into a single managed fabric', impact: 'Save 25–40% on annual licensing and support' },
      { type: 'efficiency', tip: 'Automate provisioning with intent-based networking', impact: 'Reduce deployment time from weeks to hours' },
      { type: 'risk', tip: 'Implement micro-segmentation to limit blast radius', impact: 'Reduce lateral movement risk by 90%' },
    ],
    'datacenter': [
      { type: 'cost', tip: 'Right-size power and cooling to actual utilization', impact: 'Cut energy costs by 30–50% with PUE optimization' },
      { type: 'efficiency', tip: 'Deploy hyperconverged infrastructure to eliminate silos', impact: '3x faster provisioning, single pane management' },
      { type: 'risk', tip: 'Design N+1 redundancy at every tier', impact: 'Achieve 99.982% uptime — Tier III+ certified' },
    ],
    'cloud': [
      { type: 'cost', tip: 'Use reserved instances + spot for predictable workloads', impact: 'Reduce cloud spend by 40–60% vs on-demand' },
      { type: 'efficiency', tip: 'Containerize legacy apps for cloud-native deployment', impact: '5x faster release cycles with auto-scaling' },
      { type: 'risk', tip: 'Multi-cloud strategy prevents vendor lock-in', impact: 'Negotiate 20%+ better rates with optionality' },
    ],
    'cybersecurity': [
      { type: 'cost', tip: 'Outsource SOC to our managed service vs. building in-house', impact: 'Save 60%+ vs hiring a full 24/7 security team' },
      { type: 'efficiency', tip: 'Deploy SOAR playbooks to automate incident response', impact: 'Reduce MTTR from hours to <15 minutes' },
      { type: 'risk', tip: 'Continuous pen testing + threat intel integration', impact: 'Proactive defense — stop breaches before they start' },
    ],
    'software-dev': [
      { type: 'cost', tip: 'Adopt API-first architecture to reuse across products', impact: 'Cut duplicate development effort by 50%' },
      { type: 'efficiency', tip: 'CI/CD pipeline with automated testing gates', impact: 'Ship features 4x faster with zero-downtime deploys' },
      { type: 'risk', tip: 'Shift-left security scanning in the pipeline', impact: 'Catch 95% of vulnerabilities before production' },
    ],
    'ai-ml': [
      { type: 'cost', tip: 'Start with pre-trained models, fine-tune on your data', impact: 'Reduce ML development costs by 70%' },
      { type: 'efficiency', tip: 'Deploy MLOps pipeline for automated retraining', impact: 'Models stay accurate without manual intervention' },
      { type: 'risk', tip: 'Implement model governance and bias detection', impact: 'Meet PDPL and ethical AI requirements' },
    ],
    'iot': [
      { type: 'cost', tip: 'Use edge computing to reduce cloud data transfer', impact: 'Cut bandwidth costs by 80% for high-volume sensors' },
      { type: 'efficiency', tip: 'Predictive maintenance models on device telemetry', impact: 'Reduce unplanned downtime by 45%' },
      { type: 'risk', tip: 'OT/IT network segmentation with zero-trust', impact: 'Protect SCADA systems from lateral attacks' },
    ],
    'telecom': [
      { type: 'cost', tip: 'Negotiate multi-year capacity contracts during rollout', impact: 'Lock in 25% lower per-unit infrastructure costs' },
      { type: 'efficiency', tip: 'Network slicing for differentiated service tiers', impact: 'Serve enterprise, consumer, IoT on one infrastructure' },
      { type: 'risk', tip: 'Redundant fiber paths with automatic failover', impact: '99.999% availability — five-nines guaranteed' },
    ],
    'compliance': [
      { type: 'cost', tip: 'Automated compliance monitoring vs manual audits', impact: 'Reduce audit preparation costs by 60%' },
      { type: 'efficiency', tip: 'Unified GRC platform across all frameworks', impact: 'Single dashboard for NCA, SAMA, ISO, PDPL' },
      { type: 'risk', tip: 'Continuous control testing — not just annual reviews', impact: 'Catch gaps in real-time before regulators do' },
    ],
    'erp': [
      { type: 'cost', tip: 'Phase implementation by high-impact modules first', impact: 'See ROI within 6 months instead of 2 years' },
      { type: 'efficiency', tip: 'Automate manual processes before ERP migration', impact: '40% efficiency gain from process re-engineering' },
      { type: 'risk', tip: 'Parallel-run data validation before cutover', impact: 'Zero data loss during go-live transition' },
    ],
    'blockchain': [
      { type: 'cost', tip: 'Use permissioned chains — skip gas fees entirely', impact: 'Enterprise blockchain at 1/10th public chain cost' },
      { type: 'efficiency', tip: 'Smart contracts automate multi-party workflows', impact: 'Settlement from days to seconds' },
      { type: 'risk', tip: 'Third-party smart contract audit before deployment', impact: 'Prevent exploits that cost millions' },
    ],
    'digital-transform': [
      { type: 'cost', tip: 'Prioritize quick-win automations with highest ROI', impact: 'Fund transformation from savings — not new budget' },
      { type: 'efficiency', tip: 'RPA for repetitive tasks before full platform shift', impact: 'Immediate 70% reduction in manual processing' },
      { type: 'risk', tip: 'Change management program from day one', impact: '3x higher adoption rate vs tech-only approach' },
    ],
    'project-mgmt': [
      { type: 'cost', tip: 'Resource optimization across portfolio — eliminate idle capacity', impact: 'Save 15–20% on project staffing costs' },
      { type: 'efficiency', tip: 'Agile transformation with clear sprint cadences', impact: '95% on-time delivery with predictable velocity' },
      { type: 'risk', tip: 'Risk register with automated escalation triggers', impact: 'Catch issues 3 weeks earlier than traditional PMO' },
    ],
    'business-continuity': [
      { type: 'cost', tip: 'Tiered recovery — not everything needs hot standby', impact: 'Cut DR infrastructure costs by 50%' },
      { type: 'efficiency', tip: 'Automated failover testing — monthly, not annually', impact: 'Confidence that DR works when you need it' },
      { type: 'risk', tip: 'Business impact analysis to prioritize critical systems', impact: '4-hour RTO for Tier 1 systems guaranteed' },
    ],
    'identity-mgmt': [
      { type: 'cost', tip: 'SSO reduces helpdesk password reset tickets by 80%', impact: 'Save $50K+/year in support costs alone' },
      { type: 'efficiency', tip: 'Automated user lifecycle — join/move/leave workflows', impact: 'Provision access in minutes, not days' },
      { type: 'risk', tip: 'Privileged access management for admin accounts', impact: 'Eliminate #1 attack vector — stolen credentials' },
    ],
    'training': [
      { type: 'cost', tip: 'Virtual labs replace expensive physical training environments', impact: 'Cut training infrastructure costs by 70%' },
      { type: 'efficiency', tip: 'Skill gap analysis targets training where it matters', impact: '95% certification pass rate on first attempt' },
      { type: 'risk', tip: 'Certification paths aligned to regulatory requirements', impact: 'Meet NCA workforce competency mandates' },
    ],
    'technical-support': [
      { type: 'cost', tip: 'Shift-left to L1 automation — resolve 60% without human', impact: 'Reduce support costs by 40% with AI triage' },
      { type: 'efficiency', tip: 'Proactive monitoring catches issues before users report', impact: '70% of incidents resolved before impact' },
      { type: 'risk', tip: 'SLA-backed response times with financial penalties', impact: 'Guaranteed <30min response, <4hr resolution' },
    ],
  };

  readonly archLayers: Record<string, { name: string; tools: string[] }[]> = {
    'network': [
      { name: 'Access & Edge Layer', tools: ['Switches', 'Wi-Fi 6E', 'SD-Branch'] },
      { name: 'Distribution & Core', tools: ['Spine-Leaf', 'VXLAN', 'BGP EVPN'] },
      { name: 'Security Fabric', tools: ['NGFW', 'NAC', 'Micro-Seg'] },
      { name: 'Orchestration & Monitoring', tools: ['Intent-Based', 'Telemetry', 'AIOps'] },
    ],
    'datacenter': [
      { name: 'Facility Layer', tools: ['Power', 'Cooling', 'Physical Security'] },
      { name: 'Compute & Storage', tools: ['HCI', 'SAN/NAS', 'GPU Clusters'] },
      { name: 'Virtualization', tools: ['Hypervisor', 'Containers', 'Orchestration'] },
      { name: 'Management & DCIM', tools: ['Capacity Plan', 'IPAM', 'Monitoring'] },
    ],
    'cloud': [
      { name: 'Infrastructure (IaaS)', tools: ['VMs', 'VPC', 'Load Balancers'] },
      { name: 'Platform (PaaS)', tools: ['K8s', 'Serverless', 'Managed DBs'] },
      { name: 'DevOps Pipeline', tools: ['IaC', 'CI/CD', 'GitOps'] },
      { name: 'FinOps & Governance', tools: ['Cost Mgmt', 'Tagging', 'Policy'] },
    ],
    'cybersecurity': [
      { name: 'Perimeter Defense', tools: ['NGFW', 'WAF', 'DDoS Protect'] },
      { name: 'Detection & Response', tools: ['SIEM', 'EDR', 'NDR'] },
      { name: 'Identity & Access', tools: ['MFA', 'PAM', 'Zero Trust'] },
      { name: 'Governance & Compliance', tools: ['GRC', 'Risk Mgmt', 'Audit'] },
    ],
    'software-dev': [
      { name: 'Frontend & UX', tools: ['SPA', 'PWA', 'Design System'] },
      { name: 'Backend & API', tools: ['REST', 'GraphQL', 'Microservices'] },
      { name: 'Data Layer', tools: ['SQL', 'NoSQL', 'Cache', 'Queue'] },
      { name: 'CI/CD & Ops', tools: ['Pipeline', 'Testing', 'Monitoring'] },
    ],
    'ai-ml': [
      { name: 'Data Engineering', tools: ['ETL', 'Feature Store', 'Labeling'] },
      { name: 'Model Development', tools: ['Training', 'Tuning', 'Experiment'] },
      { name: 'MLOps Pipeline', tools: ['Registry', 'Deploy', 'Monitor'] },
      { name: 'Application Layer', tools: ['API', 'Edge AI', 'Dashboard'] },
    ],
    'iot': [
      { name: 'Device & Sensors', tools: ['SCADA', 'BMS', 'Wearables'] },
      { name: 'Edge Computing', tools: ['Gateway', 'Local AI', 'Buffer'] },
      { name: 'Cloud Platform', tools: ['IoT Hub', 'Time-Series', 'Rules'] },
      { name: 'Analytics & Twin', tools: ['Dashboards', 'Predict', 'Digital Twin'] },
    ],
    'telecom': [
      { name: 'Radio Access', tools: ['5G NR', 'Small Cells', 'Massive MIMO'] },
      { name: 'Transport', tools: ['Fiber', 'Microwave', 'DWDM'] },
      { name: 'Core Network', tools: ['5GC', 'IMS', 'Packet Core'] },
      { name: 'Service Layer', tools: ['Slicing', 'QoS', 'Orchestration'] },
    ],
    'compliance': [
      { name: 'Assessment', tools: ['Gap Analysis', 'Risk Matrix', 'Interviews'] },
      { name: 'Policy Framework', tools: ['Procedures', 'Standards', 'Controls'] },
      { name: 'Implementation', tools: ['GRC Tools', 'Automation', 'Training'] },
      { name: 'Continuous Monitoring', tools: ['Dashboards', 'Alerts', 'Audit'] },
    ],
    'erp': [
      { name: 'Business Process', tools: ['BPR', 'Workflow', 'Requirements'] },
      { name: 'Core Modules', tools: ['Finance', 'HR', 'Supply Chain'] },
      { name: 'Integration', tools: ['API', 'ESB', 'Data Migration'] },
      { name: 'Analytics & Reporting', tools: ['BI', 'Dashboards', 'KPIs'] },
    ],
    'blockchain': [
      { name: 'Consensus Layer', tools: ['PoS', 'PBFT', 'Raft'] },
      { name: 'Smart Contracts', tools: ['Logic', 'Oracles', 'Tokens'] },
      { name: 'Network Layer', tools: ['Nodes', 'Channels', 'P2P'] },
      { name: 'Application & DApps', tools: ['Web3 UI', 'Wallet', 'API'] },
    ],
    'digital-transform': [
      { name: 'Assessment', tools: ['Maturity', 'Benchmarking', 'Gaps'] },
      { name: 'Strategy & Roadmap', tools: ['Vision', 'Priorities', 'KPIs'] },
      { name: 'Execution', tools: ['RPA', 'Low-Code', 'Integration'] },
      { name: 'Change & Adoption', tools: ['Training', 'Champions', 'Metrics'] },
    ],
    'project-mgmt': [
      { name: 'Portfolio Governance', tools: ['PMO Charter', 'Prioritization'] },
      { name: 'Planning & Scheduling', tools: ['WBS', 'Gantt', 'Resources'] },
      { name: 'Execution & Control', tools: ['Agile', 'Earned Value', 'Risk'] },
      { name: 'Reporting & Closure', tools: ['Dashboards', 'Lessons', 'Benefits'] },
    ],
    'business-continuity': [
      { name: 'Impact Analysis', tools: ['BIA', 'Risk Assessment', 'Criticality'] },
      { name: 'Strategy Design', tools: ['RTO/RPO', 'Hot/Warm/Cold', 'Budget'] },
      { name: 'Implementation', tools: ['Replication', 'Failover', 'Runbooks'] },
      { name: 'Testing & Drills', tools: ['Tabletop', 'Simulation', 'Audit'] },
    ],
    'identity-mgmt': [
      { name: 'Directory Services', tools: ['AD', 'LDAP', 'Federation'] },
      { name: 'Authentication', tools: ['SSO', 'MFA', 'Biometrics'] },
      { name: 'Authorization', tools: ['RBAC', 'ABAC', 'Policy Engine'] },
      { name: 'Governance', tools: ['Lifecycle', 'Certification', 'Audit'] },
    ],
    'training': [
      { name: 'Needs Assessment', tools: ['Skills Gap', 'Role Map', 'Goals'] },
      { name: 'Content Development', tools: ['Curriculum', 'Labs', 'Videos'] },
      { name: 'Delivery Platform', tools: ['LMS', 'Virtual Lab', 'Live'] },
      { name: 'Measurement', tools: ['Exams', 'Feedback', 'Certification'] },
    ],
    'technical-support': [
      { name: 'Service Desk (L1)', tools: ['Ticket', 'AI Triage', 'Self-Service'] },
      { name: 'Technical Support (L2)', tools: ['Diagnosis', 'Remote', 'Escalation'] },
      { name: 'Expert Engineering (L3)', tools: ['Root Cause', 'Patch', 'Redesign'] },
      { name: 'Proactive Operations', tools: ['Monitoring', 'Alerts', 'Capacity'] },
    ],
  };

  readonly iconPaths: Record<string, string> = {
    'network': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2c1.93 0 3.5 3.58 3.5 8s-1.57 8-3.5 8-3.5-3.58-3.5-8 1.57-8 3.5-8ZM3 12h18M4.2 7.5h15.6M4.2 16.5h15.6',
    'datacenter': 'M4 5h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 9h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z',
    'cloud': 'M6.5 19h11a4.5 4.5 0 0 0 .44-8.97 5.5 5.5 0 0 0-10.38-1.74A3.5 3.5 0 0 0 6.5 19Z',
    'cybersecurity': 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9Zm-1.5 10.5 3.5-3.5M9 12l1.5 1.5',
    'software-dev': 'M8 4l-6 8 6 8M16 4l6 8-6 8',
    'ai-ml': 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2M19 9h2m-2 6h2M7 7h10v10H7zm3 3h4v4h-4z',
    'iot': 'M12 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM8.5 15.5a5 5 0 0 1 7 0m-10-3a9 9 0 0 1 14 0m-17-3c5.3-4 11.7-4 17 0',
    'telecom': 'M12 20l-.7-.7a1 1 0 0 1 1.4 0L12 20Zm-3.5-3.5a5 5 0 0 1 7 0M5 13a9 9 0 0 1 14 0M2 10a13 13 0 0 1 20 0',
    'compliance': 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9V5Zm0 9 2 2 4-4',
    'erp': 'M3 3v18h18M7 17V12m4 5V8m4 9V5m4 12V9',
    'blockchain': 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    'digital-transform': 'M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25',
    'project-mgmt': 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'business-continuity': 'M4 4v5h5m11 11v-5h-5M20 9A8 8 0 0 0 6.2 6.2M4 15a8 8 0 0 0 13.8 2.8',
    'identity-mgmt': 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0',
    'training': 'M12 4L2 9l10 5 10-5-10-5ZM6 11v5c0 2 2.7 4 6 4s6-2 6-4v-5',
    'technical-support': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z',
  };

  categories = [
    { id: 'all', name: 'All Services', count: 17 },
    { id: 'infra', name: 'Infrastructure', count: 5 },
    { id: 'security', name: 'Security', count: 4 },
    { id: 'software', name: 'Software', count: 4 },
    { id: 'consulting', name: 'Consulting', count: 4 }
  ];

  services = [
    { id: 'network', category: 'infra',  name: 'Network Infrastructure', arabic: 'البنية التحتية للشبكات', description: 'Enterprise-grade network architectures with full redundancy and security.', features: ['SDN Architecture', 'Zero-Trust Network', 'Multi-Cloud Connectivity', '5G Integration'], techStack: ['Cisco ACI', 'VMware NSX', 'Fortinet', 'Palo Alto', 'AWS Direct Connect', 'Azure ExpressRoute'], deliverables: ['Complete network topology design', 'Redundant core/distribution/access layers', 'Network security policies and firewall rules', 'Performance monitoring dashboard', 'Disaster recovery procedures'], metric1: { value: '99.99%', label: 'Uptime SLA' }, metric2: { value: '<10ms', label: 'Latency' }, metric3: { value: '40Gbps', label: 'Throughput' } },
    { id: 'datacenter', category: 'infra',  name: 'Data Center Design', arabic: 'تصميم مراكز البيانات', description: 'Tier III/IV data center design following Uptime Institute standards.', features: ['Uptime Certified', 'Green DC Design', 'Modular Architecture', 'Edge Computing'], techStack: ['DCIM Solutions', 'Schneider EcoStruxure', 'VMware vSphere', 'Nutanix', 'Pure Storage', 'NetApp'], deliverables: ['Complete data center design documentation', 'Power and cooling capacity planning', 'Rack elevation drawings', 'Migration and deployment strategy', 'Operations runbook'], metric1: { value: 'Tier III+', label: 'Design Level' }, metric2: { value: '1.3', label: 'PUE Target' }, metric3: { value: '500', label: 'Rack Capacity' } },
    { id: 'cloud', category: 'infra',  name: 'Cloud Solutions', arabic: 'الحلول السحابية', description: 'Multi-cloud architecture design and migration for AWS, Azure, and Google Cloud.', features: ['Multi-Cloud Strategy', 'Hybrid Cloud', 'Cloud Native Apps', 'FinOps'], techStack: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Ansible', 'CloudFormation'], deliverables: ['Cloud architecture blueprints', 'Migration roadmap and timeline', 'Cost optimization strategy', 'Security and compliance framework', 'DevOps pipeline setup'], metric1: { value: '60%', label: 'Cost Reduction' }, metric2: { value: '3x', label: 'Speed Increase' }, metric3: { value: 'Auto', label: 'Scaling' } },
    { id: 'cybersecurity', category: 'security',  name: 'Cybersecurity', arabic: 'الأمن السيبراني', description: 'Comprehensive security architecture following NIST and ISO 27001 frameworks.', features: ['Zero Trust', 'SIEM/SOAR', 'Threat Intelligence', 'Incident Response'], techStack: ['CrowdStrike', 'Splunk', 'Palo Alto Cortex', 'IBM QRadar', 'Rapid7', 'Tenable'], deliverables: ['Security architecture design', 'Vulnerability assessment report', 'Penetration testing results', 'Incident response playbooks', 'Security awareness training'], metric1: { value: '24/7', label: 'SOC Coverage' }, metric2: { value: '<15min', label: 'MTTR' }, metric3: { value: '100%', label: 'Compliance' } },
    { id: 'software-dev', category: 'software',  name: 'Software Development', arabic: 'تطوير البرمجيات', description: 'Custom enterprise software using modern frameworks and agile methodologies.', features: ['Microservices', 'API-First', 'CI/CD', 'Test Automation'], techStack: ['Node.js', 'Python', 'Java', 'React', 'Angular', 'PostgreSQL', 'MongoDB', 'Redis'], deliverables: ['Full-stack application development', 'API design and documentation', 'Automated testing suite', 'CI/CD pipeline configuration', 'Production deployment and monitoring'], metric1: { value: '95%', label: 'Code Coverage' }, metric2: { value: '2-Week', label: 'Sprints' }, metric3: { value: '0-Downtime', label: 'Deployment' } },
    { id: 'ai-ml', category: 'software',  name: 'AI & Machine Learning', arabic: 'الذكاء الاصطناعي', description: 'AI/ML solutions for predictive analytics, automation, and intelligent decision-making.', features: ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps'], techStack: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'MLflow', 'Kubeflow', 'SageMaker'], deliverables: ['ML model development and training', 'Model deployment pipeline', 'Performance metrics dashboard', 'A/B testing framework', 'Continuous learning system'], metric1: { value: '92%', label: 'Accuracy' }, metric2: { value: '100ms', label: 'Inference' }, metric3: { value: 'Real-time', label: 'Processing' } },
    { id: 'iot', category: 'infra',  name: 'IoT Solutions', arabic: 'إنترنت الأشياء', description: 'End-to-end IoT platform design for smart cities, industrial automation, and asset tracking.', features: ['Edge Computing', 'MQTT/CoAP', 'Time Series DB', 'Digital Twins'], techStack: ['AWS IoT Core', 'Azure IoT Hub', 'Node-RED', 'InfluxDB', 'Grafana', 'Apache Kafka'], deliverables: ['IoT architecture design', 'Device provisioning system', 'Real-time data pipeline', 'Analytics dashboard', 'Predictive maintenance models'], metric1: { value: '1M+', label: 'Devices' }, metric2: { value: '10K/sec', label: 'Messages' }, metric3: { value: '99.9%', label: 'Reliability' } },
    { id: 'telecom', category: 'infra',  name: 'Telecom Engineering', arabic: 'هندسة الاتصالات', description: 'Design and optimization of telecom infrastructure including 5G, fiber optics, and satellite.', features: ['5G Networks', 'Fiber Design', 'RF Planning', 'Network Slicing'], techStack: ['Ericsson', 'Nokia', 'Huawei', 'Cisco', 'Juniper', 'Ciena'], deliverables: ['5G network design and rollout plan', 'RF coverage prediction maps', 'Fiber route engineering', 'Network optimization reports', 'QoS configuration'], metric1: { value: '1Gbps', label: 'Speed' }, metric2: { value: '1ms', label: 'Latency' }, metric3: { value: '99.999%', label: 'Availability' } },
    { id: 'compliance', category: 'security',  name: 'Regulatory Compliance', arabic: 'الامتثال التنظيمي', description: 'Compliance with Saudi regulations including NCA, SAMA, and CITC requirements.', features: ['NCA ECC', 'SAMA Framework', 'PDPL', 'ISO Certification'], techStack: ['GRC Platforms', 'ServiceNow', 'Archer', 'MetricStream', 'LogicGate'], deliverables: ['Compliance gap assessment', 'Policy and procedure documentation', 'Risk assessment matrix', 'Audit preparation support', 'Continuous compliance monitoring'], metric1: { value: '100%', label: 'Compliance' }, metric2: { value: '30-Day', label: 'Implementation' }, metric3: { value: 'Certified', label: 'Auditors' } },
    { id: 'erp', category: 'software',  name: 'ERP Implementation', arabic: 'تخطيط موارد المؤسسات', description: 'End-to-end ERP implementation for SAP, Oracle, and Microsoft Dynamics.', features: ['SAP S/4HANA', 'Oracle Cloud', 'Dynamics 365', 'Integration'], techStack: ['SAP', 'Oracle ERP', 'Microsoft Dynamics', 'MuleSoft', 'Dell Boomi', 'Power BI'], deliverables: ['Business process re-engineering', 'ERP system configuration', 'Data migration strategy', 'User training programs', 'Post go-live support'], metric1: { value: '40%', label: 'Efficiency Gain' }, metric2: { value: '6-Month', label: 'Deployment' }, metric3: { value: '500+', label: 'Users' } },
    { id: 'blockchain', category: 'software',  name: 'Blockchain Solutions', arabic: 'حلول البلوك تشين', description: 'Enterprise blockchain solutions for supply chain, finance, and digital identity.', features: ['Smart Contracts', 'DeFi', 'NFT Platforms', 'Hyperledger'], techStack: ['Ethereum', 'Hyperledger Fabric', 'Corda', 'Solidity', 'Web3.js', 'IPFS'], deliverables: ['Blockchain architecture design', 'Smart contract development', 'Consensus mechanism selection', 'Token economics model', 'Security audit report'], metric1: { value: '10K', label: 'TPS' }, metric2: { value: 'Gas-Free', label: 'L2 Solution' }, metric3: { value: 'Audited', label: 'Contracts' } },
    { id: 'digital-transform', category: 'consulting',  name: 'Digital Transformation', arabic: 'التحول الرقمي', description: 'Digital transformation strategy aligned with Vision 2030 objectives.', features: ['Strategy Roadmap', 'Change Management', 'Process Automation', 'Digital Culture'], techStack: ['RPA Tools', 'Low-Code Platforms', 'Analytics', 'CRM', 'Digital Workplace'], deliverables: ['Digital maturity assessment', 'Transformation roadmap', 'Technology stack selection', 'Change management plan', 'KPI framework'], metric1: { value: '3-Year', label: 'Roadmap' }, metric2: { value: '70%', label: 'Automation' }, metric3: { value: '2x', label: 'ROI' } },
    { id: 'project-mgmt', category: 'consulting',  name: 'Project Management', arabic: 'إدارة المشاريع', description: 'PMO setup and project management following PMI, PRINCE2, and Agile.', features: ['PMO Setup', 'Agile Transformation', 'Portfolio Management', 'Risk Management'], techStack: ['MS Project', 'Jira', 'Monday.com', 'Smartsheet', 'Azure DevOps', 'ServiceNow'], deliverables: ['PMO charter and governance', 'Project portfolio dashboard', 'Resource management plan', 'Risk register and mitigation', 'Benefits realization tracking'], metric1: { value: '95%', label: 'On-Time' }, metric2: { value: '±5%', label: 'Budget Variance' }, metric3: { value: 'PgMP', label: 'Certified' } },
    { id: 'business-continuity', category: 'security',  name: 'Business Continuity', arabic: 'استمرارية الأعمال', description: 'Business continuity and disaster recovery following ISO 22301 standards.', features: ['BCP/DRP', 'Crisis Management', 'Backup Solutions', 'Hot Sites'], techStack: ['Veeam', 'Zerto', 'Commvault', 'Azure Site Recovery', 'AWS Backup', 'Druva'], deliverables: ['Business impact analysis', 'Recovery strategy design', 'Disaster recovery procedures', 'Testing and drill programs', 'Crisis communication plan'], metric1: { value: '4-Hour', label: 'RTO' }, metric2: { value: '15-Min', label: 'RPO' }, metric3: { value: 'ISO 22301', label: 'Certified' } },
    { id: 'identity-mgmt', category: 'security',  name: 'Identity Management', arabic: 'إدارة الهوية', description: 'Identity and access management with SSO, MFA, and privileged access management.', features: ['Zero Trust IAM', 'Biometrics', 'SSO/SAML', 'PAM Solutions'], techStack: ['Okta', 'Azure AD', 'Ping Identity', 'CyberArk', 'ForgeRock', 'RSA'], deliverables: ['IAM architecture design', 'SSO implementation', 'MFA deployment', 'Privileged access controls', 'Identity governance framework'], metric1: { value: '99.99%', label: 'Auth Uptime' }, metric2: { value: '<2sec', label: 'Login Time' }, metric3: { value: '100%', label: 'MFA Coverage' } },
    { id: 'training', category: 'consulting',  name: 'Technical Training', arabic: 'التدريب التقني', description: 'Customized technical training programs for IT teams and end-users.', features: ['Certification Prep', 'Hands-on Labs', 'Virtual Training', 'Skill Assessment'], techStack: ['LMS Platforms', 'Virtual Labs', 'Simulation Tools', 'Assessment Platforms'], deliverables: ['Training needs assessment', 'Curriculum development', 'Training materials and labs', 'Certification preparation', 'Skills tracking dashboard'], metric1: { value: '500+', label: 'Courses' }, metric2: { value: '95%', label: 'Pass Rate' }, metric3: { value: '4.8/5', label: 'Rating' } },
    { id: 'technical-support', category: 'consulting',  name: 'Technical Support', arabic: 'الدعم الفني', description: '24/7 technical support and managed services for critical infrastructure.', features: ['24/7 NOC', 'L1-L3 Support', 'Remote Management', 'SLA Guarantee'], techStack: ['ServiceNow', 'Remedy', 'SolarWinds', 'PRTG', 'Nagios', 'Zabbix'], deliverables: ['Support level agreements', 'Escalation procedures', 'Knowledge base creation', 'Performance reporting', 'Continuous improvement plan'], metric1: { value: '24/7', label: 'Coverage' }, metric2: { value: '<30min', label: 'Response' }, metric3: { value: '99.9%', label: 'SLA Met' } },
  ];

  filteredServices() {
    if (this.selectedCategory() === 'all') return this.services;
    return this.services.filter(s => s.category === this.selectedCategory());
  }
}
