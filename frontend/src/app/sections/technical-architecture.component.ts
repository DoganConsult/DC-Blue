import { Component, signal, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-technical-architecture',
  standalone: true,
  imports: [],
  template: `
    <section class="py-24 lg:py-32 px-6 lg:px-8 bg-surface-dark" id="architecture">
      <div class="container mx-auto max-w-6xl">
        <div class="max-w-2xl mb-12">
          <p class="text-[13px] font-semibold text-sky-400 tracking-widest uppercase mb-4">{{ i18n.t('Architecture', 'الهندسة المعمارية') }}</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">{{ i18n.t('Technical Solutions', 'الحلول التقنية') }}</h2>
          <p class="text-lg text-white/50 leading-relaxed">{{ i18n.t('Enterprise-grade architecture across cloud, security, data, and AI.', 'هندسة معمارية مؤسسية عبر السحابة والأمن والبيانات والذكاء الاصطناعي.') }}</p>
        </div>

        <div class="flex flex-wrap gap-2 mb-10">
          @for (arch of architectures; track arch.id) {
            <button (click)="selectedArchitecture.set(arch.id)"
                    class="px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                    [class.bg-th-card]="selectedArchitecture() === arch.id"
                    [class.text-th-text]="selectedArchitecture() === arch.id"
                    [style.background]="selectedArchitecture() !== arch.id ? 'rgba(var(--card-rgb, 30,41,59), 0.05)' : ''"
                    [style.color]="selectedArchitecture() !== arch.id ? 'rgba(255,255,255,0.6)' : ''"
                    [class.hover:text-white]="selectedArchitecture() !== arch.id">
              {{ arch.name }}
            </button>
          }
        </div>

        <div class="bg-th-card/[0.05] border border-white/10 rounded-2xl p-8 lg:p-10 mb-10">
          @switch(selectedArchitecture()) {
            @case('cloud') {
              <div class="grid md:grid-cols-4 gap-6">
                @for (layer of cloudLayers; track layer.title) {
                  <div class="space-y-3">
                    <p class="text-[11px] font-semibold text-white/30 tracking-widest uppercase">{{ layer.title }}</p>
                    @for (item of layer.items; track item) {
                      <div class="bg-th-card/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">{{ item }}</div>
                    }
                  </div>
                }
              </div>
            }
            @case('security') {
              <div class="grid md:grid-cols-4 gap-6">
                @for (layer of securityLayers; track layer.title) {
                  <div class="space-y-3">
                    <p class="text-[11px] font-semibold text-white/30 tracking-widest uppercase">{{ layer.title }}</p>
                    @for (item of layer.items; track item) {
                      <div class="bg-th-card/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">{{ item }}</div>
                    }
                  </div>
                }
              </div>
            }
            @case('data') {
              <div class="grid md:grid-cols-4 gap-6">
                @for (layer of dataLayers; track layer.title) {
                  <div class="space-y-3">
                    <p class="text-[11px] font-semibold text-white/30 tracking-widest uppercase">{{ layer.title }}</p>
                    @for (item of layer.items; track item) {
                      <div class="bg-th-card/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">{{ item }}</div>
                    }
                  </div>
                }
              </div>
            }
            @case('ai') {
              <div class="grid md:grid-cols-4 gap-6">
                @for (layer of aiLayers; track layer.title) {
                  <div class="space-y-3">
                    <p class="text-[11px] font-semibold text-white/30 tracking-widest uppercase">{{ layer.title }}</p>
                    @for (item of layer.items; track item) {
                      <div class="bg-th-card/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">{{ item }}</div>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-th-card/[0.06] rounded-xl overflow-hidden mb-10">
          <div class="bg-surface-dark p-6 text-center">
            <div class="text-2xl font-bold text-white mb-1">99.99%</div>
            <div class="text-[13px] text-white/50">{{ i18n.t('Uptime SLA', 'اتفاقية التشغيل') }}</div>
          </div>
          <div class="bg-surface-dark p-6 text-center">
            <div class="text-2xl font-bold text-white mb-1">&lt;100ms</div>
            <div class="text-[13px] text-white/50">{{ i18n.t('Response Time', 'زمن الاستجابة') }}</div>
          </div>
          <div class="bg-surface-dark p-6 text-center">
            <div class="text-2xl font-bold text-white mb-1">Auto-Scale</div>
            <div class="text-[13px] text-white/50">{{ i18n.t('Dynamic Resources', 'موارد ديناميكية') }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          @for (tech of techStack; track tech.name) {
            <div class="bg-th-card/[0.06] border border-white/10 rounded-lg p-3 text-center">
              <div class="w-8 h-8 rounded bg-th-card/10 flex items-center justify-center mb-1">
                <svg class="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path [attr.d]="techIconPaths[tech.id]" />
                </svg>
              </div>
              <div class="text-[11px] font-medium text-white/50">{{ tech.name }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class TechnicalArchitectureComponent {
  i18n = inject(I18nService);
  selectedArchitecture = signal('cloud');

  architectures = [
    { id: 'cloud', name: 'Cloud Infrastructure' },
    { id: 'security', name: 'Security Architecture' },
    { id: 'data', name: 'Data Pipeline' },
    { id: 'ai', name: 'AI/ML Platform' }
  ];

  cloudLayers = [
    { title: 'Edge', items: ['CDN', 'WAF', 'Load Balancer', 'API Gateway'] },
    { title: 'Compute', items: ['Kubernetes', 'Serverless', 'VMs', 'Containers'] },
    { title: 'Data', items: ['PostgreSQL', 'Redis', 'S3', 'Elasticsearch'] },
    { title: 'Ops', items: ['Terraform', 'Prometheus', 'Grafana', 'CI/CD'] },
  ];

  securityLayers = [
    { title: 'Perimeter', items: ['Next-Gen Firewall', 'DDoS Protection', 'WAF', 'VPN'] },
    { title: 'Identity', items: ['Zero Trust', 'MFA/SSO', 'PAM', 'RBAC'] },
    { title: 'Detection', items: ['SIEM', 'SOAR', 'EDR', 'Threat Intel'] },
    { title: 'Compliance', items: ['NCA-ECC', 'ISO 27001', 'PDPL', 'Audit Log'] },
  ];

  dataLayers = [
    { title: 'Ingest', items: ['Kafka', 'API Feeds', 'ETL', 'IoT Streams'] },
    { title: 'Process', items: ['Spark', 'Flink', 'Airflow', 'dbt'] },
    { title: 'Store', items: ['Data Lake', 'Data Warehouse', 'Feature Store', 'Cache'] },
    { title: 'Serve', items: ['BI Dashboard', 'Alerts', 'Reports', 'APIs'] },
  ];

  aiLayers = [
    { title: 'Data Prep', items: ['Collection', 'Cleaning', 'Feature Eng.', 'Augmentation'] },
    { title: 'Training', items: ['Algorithm Select', 'Hyperparameter', 'Validation', 'Evaluation'] },
    { title: 'Deploy', items: ['Model Serving', 'A/B Testing', 'Monitoring', 'MLOps'] },
    { title: 'Production', items: ['Auto-Scale', 'Versioning', 'Feedback Loop', 'Governance'] },
  ];

  readonly techIconPaths: Record<string, string> = {
    'cloud': 'M6.5 19h11a4.5 4.5 0 0 0 .44-8.97 5.5 5.5 0 0 0-10.38-1.74A3.5 3.5 0 0 0 6.5 19Z',
    'docker': 'M4 12h4V8H4v4Zm5 0h4V8H9v4Zm5 0h4V8h-4v4ZM9 7h4V3H9v4Zm5-4v4h4V3h-4ZM3 17h18v-3H3v3Z',
    'k8s': 'M12 2L3 7v10l9 5 9-5V7l-9-5Zm0 4l5 2.75v5.5L12 17l-5-2.75v-5.5L12 6Z',
    'terraform': 'M1 4.5h7v7H1v-7Zm8.5 0h7v7h-7v-7ZM9.5 12.5h7v7h-7v-7Z',
    'grafana': 'M3 3v18h18M7 17V12m4 5V8m4 9V5m4 12V9',
    'cicd': 'M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25',
    'vault': 'M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5Zm-1 10V8h2v4h-2Zm0 4v-2h2v2h-2Z',
    'prometheus': 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  };

  techStack = [
    { id: 'cloud', name: 'AWS/Azure' },
    { id: 'docker', name: 'Docker' },
    { id: 'k8s', name: 'Kubernetes' },
    { id: 'terraform', name: 'Terraform' },
    { id: 'grafana', name: 'Grafana' },
    { id: 'cicd', name: 'CI/CD' },
    { id: 'vault', name: 'Vault' },
    { id: 'prometheus', name: 'Prometheus' }
  ];
}
