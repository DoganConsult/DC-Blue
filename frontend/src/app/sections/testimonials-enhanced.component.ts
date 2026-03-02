import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../core/services/i18n.service';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  date: string;
  relationship: string;
  highlight?: string;
  linkedinUrl?: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials-enhanced',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 px-4 bg-gradient-to-b from-th-bg-alt to-th-card" id="testimonials">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-th-bg-accent border border-th-border-lt rounded-full mb-4">
            <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span class="text-sm font-medium text-primary">{{ i18n.t('LinkedIn Verified', 'موثقة من LinkedIn') }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
            {{ i18n.t('What Industry Leaders Say', 'ماذا يقول قادة الصناعة') }}
          </h2>
          <p class="text-lg text-th-text-2 max-w-3xl mx-auto">
            {{ i18n.t(
              'Real testimonials from executives and partners across the Middle East',
              'شهادات حقيقية من المديرين التنفيذيين والشركاء في جميع أنحاء الشرق الأوسط'
            ) }}
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-8">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-primary">9+</span>
              <span class="text-sm text-th-text-3">{{ i18n.t('Endorsements', 'توصيات') }}</span>
            </div>
            <div class="w-px h-6 bg-th-bg-tert"></div>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-emerald-500">5.0</span>
              <div class="flex gap-0.5">
                @for (s of [1,2,3,4,5]; track s) {
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                }
              </div>
            </div>
            <div class="w-px h-6 bg-th-bg-tert"></div>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-purple-500">100%</span>
              <span class="text-sm text-th-text-3">{{ i18n.t('Would Recommend', 'يوصون بنا') }}</span>
            </div>
          </div>
        </div>

        <div class="relative mb-12">
          <div class="overflow-hidden rounded-3xl">
            <div class="flex transition-transform duration-500 ease-out" [style.transform]="'translateX(-' + (currentSlide() * 100) + '%)'">
              @for (testimonial of featuredTestimonials; track testimonial.name; let i = $index) {
                <div class="w-full flex-shrink-0 px-1">
                  <div class="bg-gradient-to-br from-surface-dark via-brand-dark to-surface-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div class="relative z-10 grid md:grid-cols-3 gap-8">
                      <div class="md:border-r md:border-white/10 md:pr-8">
                        <div class="w-16 h-16 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center mb-4">
                          <span class="text-xl font-bold text-white">{{ getInitials(testimonial.name) }}</span>
                        </div>
                        <h3 class="font-bold text-lg mb-1">{{ testimonial.name }}</h3>
                        <p class="text-sm text-sky-300 mb-0.5">{{ testimonial.role }}</p>
                        <p class="text-xs text-sky-400 mb-4">{{ testimonial.company }}</p>
                        <div class="flex gap-1 mb-3">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          }
                        </div>
                        <div class="space-y-1.5 text-xs text-sky-300">
                          <div class="flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                            {{ testimonial.date }}
                          </div>
                          <div class="flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                            {{ testimonial.relationship }}
                          </div>
                        </div>
                      </div>
                      <div class="md:col-span-2">
                        <svg class="w-10 h-10 text-white/10 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        @if (testimonial.highlight) {
                          <p class="text-xl md:text-2xl font-light leading-relaxed mb-5 text-cyan-100">"{{ testimonial.highlight }}"</p>
                        }
                        <p class="text-sky-200 leading-relaxed text-sm">{{ testimonial.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          @if (featuredTestimonials.length > 1) {
            <button (click)="previousSlide()" class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-th-card shadow-lg rounded-full flex items-center justify-center hover:bg-th-bg-alt transition-colors">
              <svg class="w-5 h-5 text-th-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button (click)="nextSlide()" class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-th-card shadow-lg rounded-full flex items-center justify-center hover:bg-th-bg-alt transition-colors">
              <svg class="w-5 h-5 text-th-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div class="flex justify-center gap-2 mt-6">
              @for (t of featuredTestimonials; track t.name; let i = $index) {
                <button (click)="currentSlide.set(i)" class="h-1.5 rounded-full transition-all duration-300" [class]="currentSlide() === i ? 'w-8 bg-primary' : 'w-2 bg-th-border hover:bg-th-border-dk'"></button>
              }
            </div>
          }
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (testimonial of additionalTestimonials; track testimonial.name) {
            <div class="group bg-th-card rounded-2xl p-6 border border-th-border-lt hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {{ getInitials(testimonial.name) }}
                </div>
                <div class="min-w-0">
                  <h4 class="font-semibold text-sm text-th-text truncate">{{ testimonial.name }}</h4>
                  <p class="text-xs text-th-text-3 truncate">{{ testimonial.role }}</p>
                  <p class="text-[11px] text-th-text-3 truncate">{{ testimonial.company }}</p>
                </div>
                <svg class="w-5 h-5 text-blue-500 shrink-0 ml-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </div>
              <div class="flex gap-0.5 mb-3">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                }
              </div>
              <p class="text-sm text-th-text-2 leading-relaxed mb-4">"{{ testimonial.content }}"</p>
              <div class="flex items-center justify-between pt-3 border-t border-th-border-lt">
                <span class="text-[11px] text-th-text-3">{{ testimonial.date }}</span>
                <span class="text-[11px] text-th-text-3">{{ testimonial.relationship }}</span>
              </div>
            </div>
          }
        </div>

        <div class="text-center mt-10">
          <a href="https://www.linkedin.com/in/yourprofile/details/recommendations/" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-th-card border border-th-border rounded-xl font-medium text-th-text-2 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            {{ i18n.t('View All Recommendations on LinkedIn', 'عرض جميع التوصيات على LinkedIn') }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsEnhancedComponent implements OnInit {
  i18n = inject(I18nService);
  currentSlide = signal(0);

  featuredTestimonials: Testimonial[] = [
    {
      name: 'Iman Radwan',
      role: 'Project Manager',
      company: 'Huawei Enterprise Kuwait',
      content: 'I had the pleasure of working closely with Ahmed during our collaboration on various projects. In his role as General Manager, he consistently demonstrated exceptional leadership and a profound understanding of the market and also of Huawei and all other vendors in the ELV field. Ahmed possesses an impressive ability to strategize and execute complex initiatives. I was particularly impressed by his effective management of KNG Kazmah project, where he showcased a keen attention to detail and a commitment to managing different aspects including even the technical parts as he has a very good technical understanding.',
      highlight: 'Exceptional leadership and profound understanding of the market',
      date: 'December 26, 2023',
      relationship: 'Client relationship',
      rating: 5,
      linkedinUrl: '#'
    },
    {
      name: 'Osama Yousef',
      role: 'Sr. Partners Sales Manager | Principal ICT Solutions Architect',
      company: 'Channels Enablement Specialist',
      content: 'I had the pleasure of working closely with Ahmad on several Data Center and Network solutions projects. His exceptional problem-solving skills, attention to details, and strong cooperative skills were instrumental in the success of these projects specially in responding time, with highly management skills in using the allowed resources to accomplish the tasks successfully. Ahmad is a responsible, respected person, well-educated with very good knowledge and significant number of well deserved certificates.',
      highlight: 'Exceptional problem-solving skills and attention to details',
      date: 'January 1, 2024',
      relationship: 'Worked at different companies',
      rating: 5,
      linkedinUrl: '#'
    },
    {
      name: 'Ashraf Nassar',
      role: 'Executive Manager',
      company: 'HEV Group | HVAC',
      content: 'As I was manager for integrated maintenance and ICT was part of Division with Ahmed as manager for ICT department, I can say that Ahmed is hard worker and has excellent and professional ideas and visions to the market, and follows operations right well. The department was honored as the best company in the field of data centers in the Middle East region within a year of operating the department in UAE by Huawei.',
      highlight: 'Best company in data centers in Middle East region',
      date: 'December 15, 2023',
      relationship: 'Worked on same team',
      rating: 5,
      linkedinUrl: '#'
    }
  ];

  additionalTestimonials: Testimonial[] = [
    {
      name: 'Fadi Al-Farra',
      role: 'Divisional General Manager',
      company: 'Bader Al Mulla & Bros. Co.',
      content: 'Ahmed is an icon of enthusiasm and perseverance. I had the pleasure of working closely with him on a challenging period and too critical market situation. His exceptional problem-solving skills and attention to detail were instrumental in its success.',
      date: 'January 15, 2024',
      relationship: 'Different teams',
      rating: 5
    },
    {
      name: 'Wassim Zoueihed',
      role: 'Seasoned Tech Leader',
      company: 'Huawei',
      content: 'I saw him as a leader in his domain, True customer centric and dedicated to long term relationships. He was always clear in his understanding of the clients\' needs and had a sharp focus on the needful towards success.',
      date: 'December 27, 2023',
      relationship: 'Client',
      rating: 5
    },
    {
      name: 'Camille Muhandes',
      role: 'VAD Channels Sales Manager',
      company: 'Middle East & North Africa',
      content: 'Ahmed is a high professional individual with sharp business acumen. He managed to build excellent rapport and alignment with all stakeholders. Very well organized with sharp focus on what matters to business.',
      date: 'December 11, 2023',
      relationship: 'Client',
      rating: 5
    },
    {
      name: 'Hassan Abdallah',
      role: 'Senior Product Manager',
      company: 'Aptec Saudi Arabia (VMware)',
      content: 'I was honored to work with Ahmad for the last year. He was a great help for the company and colleagues, man of his word, professional manager and a great mentor for his team.',
      date: 'January 13, 2024',
      relationship: 'Same team',
      rating: 5
    },
    {
      name: 'László Imre Ludas',
      role: 'Alliances & Sales Director',
      company: 'Oracle',
      content: 'Ahmed has been a great help throughout the years making many contracts and businesses come to fruition. Always ready to help and happy to take the next challenge.',
      date: 'December 12, 2023',
      relationship: 'Client',
      rating: 5
    },
    {
      name: 'Mohamed Shereen',
      role: 'Operations Manager',
      company: 'Gulf Group ICT',
      content: 'Ahmed is an outstanding telecom engineer and manager. He possesses a deep understanding of the telecom industry, coupled with exceptional leadership skills. His ability to manage and optimize the entire ICT division was truly impressive.',
      date: 'December 9, 2023',
      relationship: 'Direct report',
      rating: 5
    }
  ];

  ngOnInit() {
    // Auto-rotate testimonials every 10 seconds
    setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  nextSlide() {
    this.currentSlide.update(v => (v + 1) % this.featuredTestimonials.length);
  }

  previousSlide() {
    this.currentSlide.update(v => v === 0 ? this.featuredTestimonials.length - 1 : v - 1);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}