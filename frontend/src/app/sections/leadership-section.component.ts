import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

interface TeamMember {
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  bio: { en: string; ar: string };
  image?: string;
  certifications: string[];
  experience: string;
  linkedin?: string;
  specialties: string[];
}

@Component({
  selector: 'app-leadership-section',
  standalone: true,
  imports: [],
  template: `
    <section class="py-20 px-4 bg-th-bg-alt">
      <div class="container mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span class="text-sm font-medium text-indigo-700">{{ i18n.t('Our Leadership', 'قيادتنا') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('Meet the Experts Behind Your Success', 'قابل الخبراء وراء نجاحك') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Industry veterans with deep technical expertise and proven track records in digital transformation',
              'قدامى المحاربين في الصناعة مع خبرة تقنية عميقة وسجلات مثبتة في التحول الرقمي'
            ) }}
          </p>
        </div>

        <!-- Leadership Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          @for (member of leadershipTeam; track member.name.en) {
          <div class="group relative">
            <div class="bg-th-card rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <!-- Profile Image -->
              <div class="relative h-64 bg-gradient-to-br from-brand-dark to-primary">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-32 h-32 bg-th-card/20 rounded-full flex items-center justify-center">
                    <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- LinkedIn Badge -->
                @if (member.linkedin) {
                <a
                  [href]="member.linkedin"
                  target="_blank"
                  class="absolute top-4 right-4 w-10 h-10 bg-th-card rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                }

                <!-- Years of Experience Badge -->
                <div class="absolute bottom-4 left-4 px-3 py-1 bg-th-card/90 backdrop-blur rounded-full">
                  <span class="text-sm font-bold text-brand-dark">{{ member.experience }}</span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Name & Role -->
                <h3 class="text-xl font-bold text-brand-dark mb-1">
                  {{ i18n.t(member.name.en, member.name.ar) }}
                </h3>
                <p class="text-sm font-medium text-primary mb-3">
                  {{ i18n.t(member.role.en, member.role.ar) }}
                </p>

                <!-- Bio -->
                <p class="text-sm text-th-text-2 mb-4 line-clamp-3">
                  {{ i18n.t(member.bio.en, member.bio.ar) }}
                </p>

                <!-- Specialties -->
                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-th-text-3 uppercase tracking-wider mb-2">
                    {{ i18n.t('Specialties', 'التخصصات') }}
                  </h4>
                  <div class="flex flex-wrap gap-1">
                    @for (specialty of member.specialties.slice(0, 3); track specialty) {
                      <span class="px-2 py-1 bg-sky-50 text-sky-700 rounded text-xs font-medium">{{ specialty }}</span>
                    }
                    @if (member.specialties.length > 3) {
                      <span class="px-2 py-1 bg-th-bg-tert text-th-text-2 rounded text-xs font-medium">+{{ member.specialties.length - 3 }}</span>
                    }
                  </div>
                </div>

                <!-- Certifications -->
                <div>
                  <h4 class="text-xs font-semibold text-th-text-3 uppercase tracking-wider mb-2">
                    {{ i18n.t('Certifications', 'الشهادات') }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    @for (cert of member.certifications.slice(0, 4); track cert) {
                      <div class="w-8 h-8 bg-th-bg-tert rounded flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" [title]="cert">
                        <span class="text-xs font-bold">{{ getCertAbbreviation(cert) }}</span>
                      </div>
                    }
                    @if (member.certifications.length > 4) {
                      <div class="w-8 h-8 bg-th-bg-tert rounded flex items-center justify-center">
                        <span class="text-xs font-bold text-th-text-2">+{{ member.certifications.length - 4 }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Technical Team Stats -->
        <div class="bg-th-card rounded-3xl shadow-xl p-8 md:p-12">
          <h3 class="text-2xl font-bold text-brand-dark mb-8 text-center">
            {{ i18n.t('Our Technical Excellence', 'تميزنا التقني') }}
          </h3>

          <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl font-bold text-primary mb-2">50+</div>
              <div class="text-sm text-th-text-2">{{ i18n.t('Technical Experts', 'خبير تقني') }}</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-emerald-500 mb-2">200+</div>
              <div class="text-sm text-th-text-2">{{ i18n.t('Certifications', 'شهادة') }}</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-amber-500 mb-2">15+</div>
              <div class="text-sm text-th-text-2">{{ i18n.t('Years Avg Experience', 'متوسط سنوات الخبرة') }}</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-purple-500 mb-2">100%</div>
              <div class="text-sm text-th-text-2">{{ i18n.t('Certified Professionals', 'محترفون معتمدون') }}</div>
            </div>
          </div>

          <!-- Certification Logos -->
          <div class="mt-12 pt-8 border-t border-th-border">
            <p class="text-sm text-th-text-3 text-center mb-6 uppercase tracking-wider">
              {{ i18n.t('Team Certifications Include', 'شهادات الفريق تشمل') }}
            </p>
            <div class="flex flex-wrap justify-center items-center gap-8">
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">CISSP</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">CCNP</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">AWS SA Pro</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">PMP</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">TOGAF</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">CKA</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">Azure Expert</span>
              </div>
              <div class="text-th-text-3 hover:text-th-text-2 transition">
                <span class="text-sm font-bold">ITIL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Join Team CTA -->
        <div class="mt-16 bg-gradient-to-r from-primary to-sky-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 class="text-3xl font-bold mb-4">
            {{ i18n.t('Join Our Team of Experts', 'انضم إلى فريقنا من الخبراء') }}
          </h3>
          <p class="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
            {{ i18n.t(
              'We\'re always looking for talented professionals to help our clients achieve digital excellence',
              'نبحث دائمًا عن محترفين موهوبين لمساعدة عملائنا على تحقيق التميز الرقمي'
            ) }}
          </p>
          <button (click)="router.navigate(['/inquiry'])" class="inline-flex items-center gap-2 px-8 py-4 bg-th-card text-primary rounded-xl font-semibold hover:bg-sky-50 transition-all transform hover:scale-105">
            {{ i18n.t('View Open Positions', 'عرض الوظائف المتاحة') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class LeadershipSectionComponent {
  i18n = inject(I18nService);
  router = inject(Router);

  leadershipTeam: TeamMember[] = [
    {
      name: { en: 'CEO', ar: 'الرئيس التنفيذي' },
      role: { en: 'Chief Executive Officer', ar: 'الرئيس التنفيذي' },
      bio: {
        en: '25+ years leading digital transformation for enterprise and government organizations across the GCC region.',
        ar: 'أكثر من 25 عامًا في قيادة التحول الرقمي للمنظمات المؤسسية والحكومية في منطقة الخليج.'
      },
      certifications: ['PMP', 'TOGAF', 'CISSP', 'ITIL'],
      experience: '25+ Years',
      specialties: ['Digital Strategy', 'GRC', 'Enterprise Architecture', 'Change Management']
    },
    {
      name: { en: 'CTO', ar: 'الرئيس التقني' },
      role: { en: 'Chief Technology Officer', ar: 'الرئيس التقني' },
      bio: {
        en: 'Cloud and distributed systems expert with 20+ years delivering scalable enterprise platforms and AI/ML solutions.',
        ar: 'خبير في الأنظمة السحابية والموزعة مع أكثر من 20 عامًا في تقديم منصات مؤسسية قابلة للتطوير وحلول AI/ML.'
      },
      certifications: ['AWS Solutions Architect Pro', 'Azure Expert', 'GCP Professional', 'CKA', 'CKAD'],
      experience: '20+ Years',
      specialties: ['Cloud Architecture', 'AI/ML', 'DevOps', 'Microservices']
    },
    {
      name: { en: 'CISO', ar: 'رئيس أمن المعلومات' },
      role: { en: 'Chief Information Security Officer', ar: 'رئيس أمن المعلومات' },
      bio: {
        en: 'Cybersecurity leader with 18+ years of expertise in Zero Trust architecture, NCA-ECC compliance, and SOC operations.',
        ar: 'قائد في الأمن السيبراني مع أكثر من 18 عامًا من الخبرة في بنية Zero Trust وامتثال NCA-ECC وعمليات SOC.'
      },
      certifications: ['CISSP', 'CEH', 'CISM', 'CCSP', 'OSCP'],
      experience: '18+ Years',
      specialties: ['Cybersecurity', 'Zero Trust', 'SOC Operations', 'Compliance']
    },
    {
      name: { en: 'Head of Healthcare IT', ar: 'رئيس تقنية الرعاية الصحية' },
      role: { en: 'Head of Healthcare Technology', ar: 'رئيس تقنية الرعاية الصحية' },
      bio: {
        en: 'Healthcare IT specialist with 15+ years implementing HL7 FHIR standards and digital health initiatives across KSA.',
        ar: 'متخصص في تقنية الرعاية الصحية مع أكثر من 15 عامًا في تنفيذ معايير HL7 FHIR ومبادرات الصحة الرقمية في السعودية.'
      },
      certifications: ['CPHIMS', 'HL7 FHIR', 'CBAHI', 'PMP'],
      experience: '15+ Years',
      specialties: ['Healthcare IT', 'HL7 FHIR', 'HIMSS', 'Clinical Systems']
    },
    {
      name: { en: 'Head of Infrastructure', ar: 'رئيس البنية التحتية' },
      role: { en: 'Head of Infrastructure', ar: 'رئيس البنية التحتية' },
      bio: {
        en: 'Network architect with 22+ years of expertise in SDN/NFV, data center design, and enterprise-scale deployments.',
        ar: 'مهندس شبكات مع أكثر من 22 عامًا من الخبرة في SDN/NFV وتصميم مراكز البيانات والنشر على مستوى المؤسسات.'
      },
      certifications: ['CCIE', 'CCNP', 'VCP-DCV', 'RHCE', 'F5-CTS'],
      experience: '22+ Years',
      specialties: ['Network Architecture', 'Data Centers', 'SDN/NFV', 'Cloud Networking']
    },
    {
      name: { en: 'Head of AI & Innovation', ar: 'رئيس الذكاء الاصطناعي والابتكار' },
      role: { en: 'Head of AI & Innovation', ar: 'رئيس الذكاء الاصطناعي والابتكار' },
      bio: {
        en: 'AI researcher with 12+ years focused on enterprise NLP, computer vision, and ML-driven automation solutions.',
        ar: 'باحث في الذكاء الاصطناعي مع أكثر من 12 عامًا من التركيز على NLP والرؤية الحاسوبية وحلول الأتمتة بالتعلم الآلي.'
      },
      certifications: ['Google AI', 'AWS ML', 'TensorFlow Developer', 'Azure AI'],
      experience: '12+ Years',
      specialties: ['Machine Learning', 'NLP', 'Computer Vision', 'MLOps']
    }
  ];

  getCertAbbreviation(cert: string): string {
    const abbr = cert.split(' ').map(word => word[0]).join('');
    return abbr.length > 3 ? cert.substring(0, 3) : abbr;
  }
}