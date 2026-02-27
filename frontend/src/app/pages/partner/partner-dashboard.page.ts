import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { getKsaCrActivityLabel } from '../../core/data/ksa-cr-activities';

interface Lead {
  id: string;
  contact_name: string;
  contact_email: string;
  company_name: string;
  product_line: string;
  status: string;
  created_at: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-partner-dashboard',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[var(--brand-dark)] via-[#0c4a82] to-[var(--brand-darker)]">
      <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a class="text-white font-bold text-xl tracking-tight cursor-pointer" (click)="router.navigate(['/'])">
          Dogan<span class="text-[var(--gold)]">Consult</span>
        </a>
        <div class="flex items-center gap-3">
          <button (click)="i18n.setLang(i18n.lang() === 'en' ? 'ar' : 'en')"
                  class="text-white/80 hover:text-white text-sm border border-white/20 px-3 py-1 rounded-full transition">
            {{ i18n.t('عربي', 'English') }}
          </button>
        </div>
      </nav>

      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Auth Gate -->
        @if (!authenticated()) {
          <div class="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 class="text-xl font-bold text-white mb-4 text-center">{{ i18n.t('Partner Portal Login', 'دخول بوابة الشركاء') }}</h2>
            <p class="text-white/60 text-sm mb-6 text-center">{{ i18n.t('Enter your API key to access your dashboard.', 'أدخل مفتاح API للوصول إلى لوحة التحكم.') }}</p>
            @if (authError()) {
              <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-3 mb-4 text-sm text-center">{{ authError() }}</div>
            }
            <input [(ngModel)]="apiKeyInput" type="password" [placeholder]="i18n.t('API Key', 'مفتاح API')"
                   class="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            <button (click)="login()" [disabled]="loadingAuth()"
                    class="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[var(--gold)] to-amber-600 text-white hover:shadow-lg transition disabled:opacity-50">
              {{ i18n.t('Access Dashboard', 'الدخول') }}
            </button>
            <p class="text-center mt-4">
              <a class="text-[var(--gold)] text-sm cursor-pointer hover:underline" (click)="router.navigate(['/partner/register'])">
                {{ i18n.t('Don\\'t have a key? Register here', 'ليس لديك مفتاح؟ سجل هنا') }}
              </a>
            </p>
          </div>
        } @else {
          <!-- Dashboard -->
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-white">{{ i18n.t('Partner Dashboard', 'لوحة تحكم الشريك') }}</h1>
            <button (click)="router.navigate(['/partner/submit'])"
                    class="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-[var(--gold)] to-amber-600 text-white hover:shadow-lg transition text-sm">
              + {{ i18n.t('Submit Lead', 'إرسال عميل محتمل') }}
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-white">{{ leads().length }}</p>
              <p class="text-white/50 text-sm">{{ i18n.t('Total Leads', 'إجمالي العملاء') }}</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-emerald-400">{{ wonCount() }}</p>
              <p class="text-white/50 text-sm">{{ i18n.t('Won', 'تم الفوز') }}</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-amber-400">{{ inProgressCount() }}</p>
              <p class="text-white/50 text-sm">{{ i18n.t('In Progress', 'قيد التنفيذ') }}</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-red-400">{{ lostCount() }}</p>
              <p class="text-white/50 text-sm">{{ i18n.t('Lost', 'خسارة') }}</p>
            </div>
          </div>

          <!-- Leads Table -->
          <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-white/10">
                    <th class="text-left text-white/50 font-medium px-4 py-3">{{ i18n.t('Contact', 'الاسم') }}</th>
                    <th class="text-left text-white/50 font-medium px-4 py-3">{{ i18n.t('Company', 'الشركة') }}</th>
                    <th class="text-left text-white/50 font-medium px-4 py-3">{{ i18n.t('Service', 'الخدمة') }}</th>
                    <th class="text-left text-white/50 font-medium px-4 py-3">{{ i18n.t('Status', 'الحالة') }}</th>
                    <th class="text-left text-white/50 font-medium px-4 py-3">{{ i18n.t('Date', 'التاريخ') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (lead of leads(); track lead.id) {
                    <tr class="border-b border-white/5 hover:bg-white/5 transition">
                      <td class="px-4 py-3">
                        <p class="text-white font-medium">{{ lead.contact_name }}</p>
                        <p class="text-white/40 text-xs">{{ lead.contact_email }}</p>
                      </td>
                      <td class="px-4 py-3 text-white/70">{{ lead.company_name }}</td>
                      <td class="px-4 py-3 text-white/70">{{ serviceLabel(lead.product_line) }}</td>
                      <td class="px-4 py-3">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium"
                              [class]="statusClass(lead.status)">{{ lead.status }}</span>
                      </td>
                      <td class="px-4 py-3 text-white/50 text-xs">{{ lead.created_at | date:'mediumDate' }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="px-4 py-10 text-center text-white/40">{{ i18n.t('No leads yet. Submit your first lead!', 'لا يوجد عملاء بعد. أرسل أول عميل!') }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PartnerDashboardPage implements OnInit {
  i18n = inject(I18nService);
  http = inject(HttpClient);
  router = inject(Router);

  authenticated = signal(false);
  loadingAuth = signal(false);
  authError = signal<string | null>(null);
  apiKeyInput = '';
  leads = signal<Lead[]>([]);
  wonCount = computed(() => this.leads().filter(l => l.status === 'won').length);
  inProgressCount = computed(() => this.leads().filter(l => l.status === 'open' || l.status === 'new').length);
  lostCount = computed(() => this.leads().filter(l => l.status === 'lost').length);

  ngOnInit() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_partner_key') : null;
    if (saved) {
      this.apiKeyInput = saved;
      this.login();
    }
  }

  login() {
    if (!this.apiKeyInput.trim()) return;
    this.loadingAuth.set(true);
    this.authError.set(null);
    this.http.get<{ data: Lead[] }>('/api/v1/partners/leads', {
      headers: { 'x-api-key': this.apiKeyInput.trim() },
    }).subscribe({
      next: (res) => {
        this.loadingAuth.set(false);
        this.authenticated.set(true);
        this.leads.set(res.data || []);
        if (typeof localStorage !== 'undefined') localStorage.setItem('dc_partner_key', this.apiKeyInput.trim());
      },
      error: (err) => {
        this.loadingAuth.set(false);
        this.authError.set(err.error?.error || this.i18n.t('Invalid API key.', 'مفتاح API غير صالح.'));
      },
    });
  }

  statusClass(s: string) {
    const map: Record<string, string> = {
      new: 'bg-sky-500/20 text-sky-300',
      open: 'bg-amber-500/20 text-amber-300',
      qualified: 'bg-purple-500/20 text-purple-300',
      won: 'bg-emerald-500/20 text-emerald-300',
      lost: 'bg-red-500/20 text-red-300',
    };
    return map[s] || 'bg-white/10 text-white/60';
  }

  serviceLabel(code: string | null | undefined): string {
    if (!code) return '—';
    return getKsaCrActivityLabel(code, this.i18n.lang() === 'ar' ? 'ar' : 'en');
  }
}
