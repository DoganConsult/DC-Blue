import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { I18nService } from '../../core/services/i18n.service';
import { CustomerApiService } from '../../core/services/customer-api.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-th-bg-alt">
      <!-- Top bar -->
      <header class="bg-th-card border-b border-th-border">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">
          <a routerLink="/" class="flex items-center gap-3 shrink-0">
            <span class="font-bold text-[17px] text-th-text tracking-tight">Dogan<span class="text-primary">Consult</span></span>
          </a>
          <div class="flex items-center gap-4">
            <span class="text-sm text-th-text-3">{{ i18n.t('Welcome', 'مرحباً') }}, <strong class="text-th-text">{{ userName() }}</strong></span>
            <button (click)="logout()" class="text-sm text-th-text-3 hover:text-th-text transition-colors">
              {{ i18n.t('Sign Out', 'تسجيل الخروج') }}
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard content -->
      <main class="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div class="mb-10 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-th-text mb-1">{{ i18n.t('Customer Portal', 'بوابة العميل') }}</h1>
            <p class="text-th-text-3 text-sm">{{ i18n.t('Manage your projects, inquiries, and account.', 'إدارة مشاريعك واستفساراتك وحسابك.') }}</p>
          </div>
          @if (inquiries().length > 0) {
            <button (click)="exportCsv()" class="px-4 py-2 rounded-lg border border-th-border text-sm text-th-text hover:bg-th-bg-alt transition-colors">
              {{ i18n.t('Export CSV', 'تصدير CSV') }}
            </button>
          }
        </div>

        <!-- Stats cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div class="bg-th-card rounded-xl border border-th-border p-6">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-sky-100">
              <svg class="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-th-text">{{ stats()?.total ?? '—' }}</p>
            <p class="text-xs text-th-text-3 mt-1">{{ i18n.t('Total Inquiries', 'إجمالي الاستفسارات') }}</p>
          </div>
          <div class="bg-th-card rounded-xl border border-th-border p-6">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-emerald-100">
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-th-text">{{ stats()?.recent_count ?? '—' }}</p>
            <p class="text-xs text-th-text-3 mt-1">{{ i18n.t('Last 30 Days', 'آخر 30 يومًا') }}</p>
          </div>
          <div class="bg-th-card rounded-xl border border-th-border p-6">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-amber-100">
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-th-text">{{ getStatusCount('contacted') + getStatusCount('proposal') }}</p>
            <p class="text-xs text-th-text-3 mt-1">{{ i18n.t('In Progress', 'قيد التنفيذ') }}</p>
          </div>
          <div class="bg-th-card rounded-xl border border-th-border p-6">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-violet-100">
              <svg class="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-th-text">{{ getStatusCount('won') }}</p>
            <p class="text-xs text-th-text-3 mt-1">{{ i18n.t('Won', 'تم الفوز') }}</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          @for (card of quickActions; track card.title.en) {
            <a [routerLink]="card.route" class="bg-th-card rounded-xl border border-th-border p-6 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" [class]="card.iconBg">
                <svg class="w-5 h-5" [class]="card.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="card.iconPath" />
                </svg>
              </div>
              <h3 class="font-semibold text-th-text text-sm mb-1 group-hover:text-primary transition-colors">{{ i18n.t(card.title.en, card.title.ar) }}</h3>
              <p class="text-xs text-th-text-3">{{ i18n.t(card.desc.en, card.desc.ar) }}</p>
            </a>
          }
        </div>

        <!-- Inquiries table + Account sidebar -->
        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-th-card rounded-xl border border-th-border p-6">
            <h2 class="font-semibold text-th-text mb-4">{{ i18n.t('Your Inquiries', 'استفساراتك') }}</h2>

            @if (loading()) {
              <div class="text-center py-12 text-th-text-3">
                <p class="text-sm">{{ i18n.t('Loading...', 'جارِ التحميل...') }}</p>
              </div>
            } @else if (error()) {
              <div class="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{{ error() }}</div>
            } @else if (inquiries().length === 0) {
              <div class="text-center py-12 text-th-text-3">
                <svg class="w-10 h-10 mx-auto mb-3 text-th-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <p class="text-sm">{{ i18n.t('No inquiries yet.', 'لا توجد استفسارات بعد.') }}</p>
                <a routerLink="/inquiry" class="inline-block mt-4 px-5 py-2 rounded-lg bg-th-bg-inv text-th-text-inv text-sm font-semibold hover:opacity-90 transition-opacity">
                  {{ i18n.t('Submit an Inquiry', 'تقديم استفسار') }}
                </a>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-th-text-3 border-b border-th-border-lt">
                      <th class="pb-3 font-medium">{{ i18n.t('Ticket', 'التذكرة') }}</th>
                      <th class="pb-3 font-medium">{{ i18n.t('Company', 'الشركة') }}</th>
                      <th class="pb-3 font-medium">{{ i18n.t('Service', 'الخدمة') }}</th>
                      <th class="pb-3 font-medium">{{ i18n.t('Status', 'الحالة') }}</th>
                      <th class="pb-3 font-medium">{{ i18n.t('Date', 'التاريخ') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (inq of inquiries(); track inq.id) {
                      <tr class="border-b border-th-border-lt last:border-0 hover:bg-th-bg-alt/50">
                        <td class="py-3 font-mono text-xs text-primary">{{ inq.ticket_number }}</td>
                        <td class="py-3 text-th-text">{{ inq.company_name }}</td>
                        <td class="py-3 text-th-text-3">{{ inq.product_line || '—' }}</td>
                        <td class="py-3">
                          <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium" [class]="statusClass(inq.status)">{{ inq.status }}</span>
                        </td>
                        <td class="py-3 text-th-text-3 text-xs">{{ inq.created_at | date:'mediumDate' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-th-border-lt">
                  <span class="text-xs text-th-text-3">{{ i18n.t('Page', 'صفحة') }} {{ currentPage() }} / {{ totalPages() }}</span>
                  <div class="flex gap-2">
                    <button (click)="prevPage()" [disabled]="currentPage() <= 1" class="px-3 py-1 rounded border border-th-border text-xs disabled:opacity-40">{{ i18n.t('Previous', 'السابق') }}</button>
                    <button (click)="nextPage()" [disabled]="currentPage() >= totalPages()" class="px-3 py-1 rounded border border-th-border text-xs disabled:opacity-40">{{ i18n.t('Next', 'التالي') }}</button>
                  </div>
                </div>
              }
            }
          </div>

          <div class="bg-th-card rounded-xl border border-th-border p-6">
            <h2 class="font-semibold text-th-text mb-4">{{ i18n.t('Account', 'الحساب') }}</h2>
            <div class="space-y-4">
              <div>
                <p class="text-xs text-th-text-3 mb-0.5">{{ i18n.t('Email', 'البريد الإلكتروني') }}</p>
                <p class="text-sm text-th-text">{{ userEmail() }}</p>
              </div>
              <div>
                <p class="text-xs text-th-text-3 mb-0.5">{{ i18n.t('Role', 'الدور') }}</p>
                <p class="text-sm text-th-text capitalize">{{ userRole() }}</p>
              </div>
              <div class="pt-3 border-t border-th-border-lt flex items-center justify-between">
                <div>
                  <p class="text-xs text-th-text-3 mb-0.5">{{ i18n.t('Two-Factor Auth (MFA)', 'المصادقة الثنائية') }}</p>
                  <p class="text-xs text-th-text-3">{{ mfaEnabled() ? i18n.t('Enabled — code sent on login', 'مفعّل — يُرسل رمز عند تسجيل الدخول') : i18n.t('Disabled — password only', 'معطّل — كلمة المرور فقط') }}</p>
                </div>
                <button (click)="toggleMfa()" [disabled]="mfaToggling()"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        [class.bg-primary]="mfaEnabled()" [class.bg-gray-300]="!mfaEnabled()">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        [class.translate-x-6]="mfaEnabled()" [class.translate-x-1]="!mfaEnabled()"></span>
                </button>
              </div>
              <div class="pt-3 border-t border-th-border-lt">
                <a routerLink="/change-password" class="text-sm text-primary hover:underline">
                  {{ i18n.t('Change Password', 'تغيير كلمة المرور') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class CustomerDashboardPage implements OnInit {
  i18n = inject(I18nService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private api = inject(CustomerApiService);

  userName = signal('');
  userEmail = signal('');
  userRole = signal('');
  mfaEnabled = signal(false);
  mfaToggling = signal(false);

  stats = signal<{ total: number; by_status: { status: string; count: number }[]; recent_count: number } | null>(null);
  inquiries = signal<any[]>([]);
  totalInquiries = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(true);
  error = signal<string | null>(null);

  quickActions = [
    {
      title: { en: 'New Inquiry', ar: 'استفسار جديد' },
      desc: { en: 'Submit a project request', ar: 'تقديم طلب مشروع' },
      route: '/inquiry',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-500',
      iconPath: 'M12 4.5v15m7.5-7.5h-15',
    },
    {
      title: { en: 'Track Inquiry', ar: 'تتبع الاستفسار' },
      desc: { en: 'Check inquiry status', ar: 'تحقق من حالة الاستفسار' },
      route: '/track',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
      iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    },
    {
      title: { en: 'Our Services', ar: 'خدماتنا' },
      desc: { en: 'Browse ICT solutions', ar: 'تصفح حلول تقنية المعلومات' },
      route: '/',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
      iconPath: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    },
    {
      title: { en: 'Account Settings', ar: 'إعدادات الحساب' },
      desc: { en: 'Manage your profile', ar: 'إدارة ملفك الشخصي' },
      route: '/change-password',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-500',
      iconPath: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
    },
  ];

  ngOnInit() {
    try {
      const userStr = localStorage.getItem('dc_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userName.set(user.full_name || user.name || user.email?.split('@')[0] || 'User');
        this.userEmail.set(user.email || '');
        this.userRole.set(user.role || 'customer');
        this.mfaEnabled.set(!!user.mfa_enabled);
      }
    } catch {
      // fallback
    }

    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {},
    });

    this.api.getInquiries({ page: String(this.currentPage()), limit: '20' }).subscribe({
      next: (res) => {
        this.inquiries.set(res.data);
        this.totalInquiries.set(res.total);
        this.totalPages.set(Math.max(1, Math.ceil(res.total / res.limit)));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || this.i18n.t('Failed to load inquiries.', 'فشل تحميل الاستفسارات.'));
      },
    });
  }

  getStatusCount(status: string): number {
    return this.stats()?.by_status.find(s => s.status === status)?.count ?? 0;
  }

  statusClass(status: string): string {
    switch (status) {
      case 'new': return 'bg-sky-100 text-sky-700';
      case 'qualified': return 'bg-indigo-100 text-indigo-700';
      case 'contacted': return 'bg-amber-100 text-amber-700';
      case 'proposal': return 'bg-purple-100 text-purple-700';
      case 'won': return 'bg-emerald-100 text-emerald-700';
      case 'lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadData();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadData();
    }
  }

  exportCsv() {
    this.api.exportInquiries().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {},
    });
  }

  toggleMfa() {
    const newState = !this.mfaEnabled();
    this.mfaToggling.set(true);
    const token = localStorage.getItem('dc_user_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post<{ ok: boolean; mfa_enabled: boolean }>('/api/v1/public/auth/toggle-mfa', { enable: newState }, { headers }).subscribe({
      next: (r) => {
        this.mfaEnabled.set(r.mfa_enabled);
        this.mfaToggling.set(false);
        // Update stored user
        try {
          const userStr = localStorage.getItem('dc_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.mfa_enabled = r.mfa_enabled;
            localStorage.setItem('dc_user', JSON.stringify(user));
          }
        } catch {}
      },
      error: () => this.mfaToggling.set(false),
    });
  }

  logout() {
    localStorage.removeItem('dc_user_token');
    localStorage.removeItem('dc_user');
    sessionStorage.removeItem('dc_admin_token');
    sessionStorage.removeItem('dc_portal_user');
    this.router.navigate(['/']);
  }
}
