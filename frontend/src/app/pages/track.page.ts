import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { STATUS_COLORS } from '../core/data/page-styles';

interface TicketInfo {
  ticket_number: string;
  status: string;
  company_name: string;
  contact_name: string;
  product_line: string;
  submitted_at: string;
  last_updated: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-track',
  template: `
    <div class="bg-gradient-to-br from-brand-dark via-primary-dark to-brand-darker">
      <div class="max-w-lg mx-auto px-4 py-16">
        <div class="text-center mb-10">
          <div class="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white mb-3">
            {{ i18n.t('Track Your Inquiry', 'تتبع استفسارك') }}
          </h1>
          <p class="text-white/60">
            {{ i18n.t('Enter your ticket number to check the status of your inquiry.', 'أدخل رقم التذكرة لمعرفة حالة استفسارك.') }}
          </p>
        </div>

        <div class="bg-th-card/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
          <div class="flex gap-3 mb-6">
            <input [(ngModel)]="ticketInput" [placeholder]="i18n.t('e.g. DC202603-ABC123', 'مثال: DC202603-ABC123')"
                   (keyup.enter)="lookup()"
                   class="flex-1 bg-th-card/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
            <button (click)="lookup()" [disabled]="loading()"
                    class="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg transition disabled:opacity-50">
              {{ i18n.t('Track', 'تتبع') }}
            </button>
          </div>

          @if (error()) {
            <div class="bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl p-4 text-center text-sm">
              {{ error() }}
            </div>
          }

          @if (result()) {
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-white/50 text-sm">{{ i18n.t('Ticket', 'التذكرة') }}</span>
                <span class="text-gold font-mono font-bold text-lg">{{ result()!.ticket_number }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-white/50 text-sm">{{ i18n.t('Status', 'الحالة') }}</span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold" [class]="statusClass(result()!.status)">
                  {{ statusLabel(result()!.status) }}
                </span>
              </div>
              <hr class="border-white/10" />
              <div class="flex items-center justify-between">
                <span class="text-white/50 text-sm">{{ i18n.t('Company', 'الشركة') }}</span>
                <span class="text-white">{{ result()!.company_name }}</span>
              </div>
              @if (result()!.product_line) {
                <div class="flex items-center justify-between">
                  <span class="text-white/50 text-sm">{{ i18n.t('Service', 'الخدمة') }}</span>
                  <span class="text-white">{{ result()!.product_line }}</span>
                </div>
              }
              <div class="flex items-center justify-between">
                <span class="text-white/50 text-sm">{{ i18n.t('Submitted', 'تاريخ الإرسال') }}</span>
                <span class="text-white/70 text-sm">{{ result()!.submitted_at | date:'medium' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-white/50 text-sm">{{ i18n.t('Last Updated', 'آخر تحديث') }}</span>
                <span class="text-white/70 text-sm">{{ result()!.last_updated | date:'medium' }}</span>
              </div>
            </div>
          }
        </div>

        <p class="text-center mt-6">
          <a class="text-primary text-sm cursor-pointer hover:underline" (click)="router.navigate(['/inquiry'])">
            {{ i18n.t('Submit a new inquiry', 'إرسال استفسار جديد') }}
          </a>
        </p>
      </div>
    </div>
  `,
})
export class TrackPage {
  i18n = inject(I18nService);
  private http = inject(HttpClient);
  router = inject(Router);

  ticketInput = '';
  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<TicketInfo | null>(null);

  lookup() {
    if (!this.ticketInput.trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.http.get<TicketInfo>(`/api/v1/public/track/${encodeURIComponent(this.ticketInput.trim())}`).subscribe({
      next: (r) => { this.loading.set(false); this.result.set(r); },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.error.set(this.i18n.t('Ticket not found. Please check the number and try again.', 'التذكرة غير موجودة. يرجى التحقق من الرقم والمحاولة مرة أخرى.'));
        } else {
          this.error.set(this.i18n.t('Something went wrong. Please try again.', 'حدث خطأ. يرجى المحاولة مرة أخرى.'));
        }
      },
    });
  }

  statusClass(s: string): string {
    return STATUS_COLORS[s] || 'bg-th-card/10 text-white/60';
  }

  statusLabel(s: string): string {
    const en: Record<string, string> = {
      new: 'Received', qualified: 'Under Review', contacted: 'In Contact',
      proposal: 'Proposal Sent', won: 'Completed', lost: 'Closed',
    };
    const ar: Record<string, string> = {
      new: 'تم الاستلام', qualified: 'قيد المراجعة', contacted: 'قيد التواصل',
      proposal: 'تم إرسال العرض', won: 'مكتمل', lost: 'مغلق',
    };
    return this.i18n.t(en[s] || s, ar[s] || s);
  }
}
