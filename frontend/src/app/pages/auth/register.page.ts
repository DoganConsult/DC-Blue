import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-950 text-white flex flex-col">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <a routerLink="/" class="flex items-center gap-2 text-white font-bold text-lg tracking-wide hover:opacity-80 transition">
          <span class="text-[#0EA5E9]">◈</span> Dogan Consult
        </a>
        <span class="text-gray-500 text-sm">Already have an account? <a routerLink="/login" class="text-[#0EA5E9] hover:underline">Sign in</a></span>
      </div>

      <!-- Body -->
      <div class="flex-1 flex flex-col lg:flex-row">

        <!-- Left: choose your path -->
        <div class="lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800 flex flex-col justify-center px-10 py-16">
          <h1 class="text-3xl font-bold mb-3">Join the platform</h1>
          <p class="text-gray-400 mb-10 text-sm leading-relaxed">
            Create your account to access the tools, submit inquiries, track projects,<br class="hidden lg:block" />
            or apply as a consulting partner.
          </p>

          <div class="space-y-4">
            <div (click)="setIntent('client')" class="w-full flex items-start gap-4 p-4 rounded-xl border transition text-left cursor-pointer"
                 [class.border-sky-500]="intent()==='client'" [class.bg-sky-950]="intent()==='client'"
                 [class.border-gray-700]="intent()!=='client'" [class.hover:bg-gray-800]="true">
              <span class="text-2xl mt-0.5">&#127962;</span>
              <div><p class="font-semibold text-sm">Client / Visitor</p><p class="text-gray-500 text-xs mt-0.5">Submit inquiries, track project status, explore ICT services.</p></div>
            </div>

            <div (click)="setIntent('partner')" class="w-full flex items-start gap-4 p-4 rounded-xl border transition text-left cursor-pointer"
                 [class.border-sky-500]="intent()==='partner'" [class.bg-sky-950]="intent()==='partner'"
                 [class.border-gray-700]="intent()!=='partner'">
              <span class="text-2xl mt-0.5">&#129309;</span>
              <div><p class="font-semibold text-sm">Consulting Partner</p><p class="text-gray-500 text-xs mt-0.5">Refer leads, earn commissions, access the partner portal.</p></div>
            </div>

            <div (click)="setIntent('employee')" class="w-full flex items-start gap-4 p-4 rounded-xl border transition text-left cursor-pointer"
                 [class.border-sky-500]="intent()==='employee'" [class.bg-sky-950]="intent()==='employee'"
                 [class.border-gray-700]="intent()!=='employee'">
              <span class="text-2xl mt-0.5">&#128100;</span>
              <div><p class="font-semibold text-sm">Team Member</p><p class="text-gray-500 text-xs mt-0.5">Internal staff — manage leads, opportunities, and engagements.</p></div>
            </div>
          </div>
        </div>

        <!-- Right: registration form -->
        <div class="lg:w-1/2 flex items-center justify-center px-8 py-16">
          <div class="w-full max-w-md">
            <h2 class="text-2xl font-bold mb-1">Create your account</h2>
            <p class="text-gray-500 text-sm mb-8">
              @if (intent() === 'partner') { You'll be redirected to the partner registration form after sign-up. }
              @else if (intent() === 'employee') { Team member accounts require admin approval. }
              @else { Fill in your details to get started. }
            </p>

            @if (success()) {
              <div class="bg-emerald-900/40 border border-emerald-700 rounded-xl p-5 mb-6 text-center">
                <p class="text-emerald-300 font-semibold text-lg mb-1">Account created!</p>
                <p class="text-emerald-400/80 text-sm mb-4">Welcome, <strong>{{ form.username }}</strong>. You are now signed in.</p>
                @if (intent() === 'partner') {
                  <a routerLink="/partner/register" class="inline-block px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl text-sm font-semibold hover:bg-[#0EA5E9]/80 transition">Continue to Partner Registration →</a>
                } @else if (intent() === 'employee') {
                  <a routerLink="/admin" class="inline-block px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl text-sm font-semibold hover:bg-[#0EA5E9]/80 transition">Go to Dashboard →</a>
                } @else {
                  <a routerLink="/" class="inline-block px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl text-sm font-semibold hover:bg-[#0EA5E9]/80 transition">Go to Home →</a>
                }
              </div>
            } @else {
              <form (ngSubmit)="register()" #f="ngForm" class="space-y-4">

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-400 text-xs mb-1.5 font-medium">Full Name</label>
                    <input [(ngModel)]="form.name" name="name" placeholder="Jane Smith"
                           class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                  </div>
                  <div>
                    <label class="block text-gray-400 text-xs mb-1.5 font-medium">Username <span class="text-red-400">*</span></label>
                    <input [(ngModel)]="form.username" name="username" placeholder="janesmith" required
                           class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                  </div>
                </div>

                <div>
                  <label class="block text-gray-400 text-xs mb-1.5 font-medium">Email Address <span class="text-red-400">*</span></label>
                  <input [(ngModel)]="form.email" name="email" type="email" placeholder="jane@company.com" required
                         class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                </div>

                <div>
                  <label class="block text-gray-400 text-xs mb-1.5 font-medium">Company / Organisation</label>
                  <input [(ngModel)]="form.company" name="company" placeholder="Acme Corp (optional)"
                         class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                </div>

                <div>
                  <label class="block text-gray-400 text-xs mb-1.5 font-medium">Password <span class="text-red-400">*</span></label>
                  <div class="relative">
                    <input [(ngModel)]="form.password" name="password" [type]="showPw() ? 'text' : 'password'" placeholder="Min. 8 characters" required
                           class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                    <button type="button" (click)="showPw.set(!showPw())" class="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition text-xs px-1 py-0.5">
                      {{ showPw() ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                  <div class="flex gap-1 mt-2">
                    <div class="h-1 flex-1 rounded-full transition-colors" [class.bg-gray-700]="pwStrength()<1" [class.bg-red-500]="pwStrength()===1" [class.bg-orange-500]="pwStrength()===2" [class.bg-yellow-500]="pwStrength()===3" [class.bg-emerald-500]="pwStrength()===4"></div>
                    <div class="h-1 flex-1 rounded-full transition-colors" [class.bg-gray-700]="pwStrength()<2" [class.bg-red-500]="pwStrength()===1&&pwStrength()>=2" [class.bg-orange-500]="pwStrength()>=2&&pwStrength()<=2" [class.bg-yellow-500]="pwStrength()>=3&&pwStrength()<=3" [class.bg-emerald-500]="pwStrength()>=4"></div>
                    <div class="h-1 flex-1 rounded-full transition-colors" [class.bg-gray-700]="pwStrength()<3" [class.bg-yellow-500]="pwStrength()===3" [class.bg-emerald-500]="pwStrength()>=4"></div>
                    <div class="h-1 flex-1 rounded-full transition-colors" [class.bg-gray-700]="pwStrength()<4" [class.bg-emerald-500]="pwStrength()>=4"></div>
                  </div>
                </div>

                <div>
                  <label class="block text-gray-400 text-xs mb-1.5 font-medium">Confirm Password <span class="text-red-400">*</span></label>
                  <input [(ngModel)]="form.confirm" name="confirm" [type]="showPw() ? 'text' : 'password'" placeholder="Re-enter password" required
                         class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition"
                         [class.border-red-600]="form.confirm && form.confirm !== form.password" />
                  @if (form.confirm && form.confirm !== form.password) {
                    <p class="text-red-400 text-xs mt-1">Passwords do not match</p>
                  }
                </div>

                @if (error()) {
                  <div class="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">{{ error() }}</div>
                }

                <button type="submit" [disabled]="loading() || !canSubmit()"
                        class="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-semibold text-sm hover:bg-[#0EA5E9]/80 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  @if (loading()) {
                    <span class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                      Creating account...
                    </span>
                  } @else {
                    Create Account
                  }
                </button>

                <p class="text-center text-gray-600 text-xs pt-2">
                  By registering you agree to the platform terms. Accounts are for legitimate business use only.
                </p>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterPage {
  private http = inject(HttpClient);
  private router = inject(Router);

  intent = signal<'client' | 'partner' | 'employee'>('client');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showPw = signal(false);

  form = { name: '', username: '', email: '', company: '', password: '', confirm: '' };

  setIntent(v: 'client' | 'partner' | 'employee') { this.intent.set(v); }

  pwStrength(): number {
    const p = this.form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  canSubmit() {
    return this.form.username.trim().length >= 3 &&
      this.form.email.includes('@') &&
      this.form.password.length >= 8 &&
      this.form.password === this.form.confirm;
  }

  register() {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<{ ok: boolean; token: string; user: any }>('/api/v1/public/auth/register', {
      username: this.form.username.trim(),
      email: this.form.email.trim(),
      password: this.form.password,
      name: this.form.name.trim() || this.form.username.trim(),
    }).subscribe({
      next: (r) => {
        this.loading.set(false);
        localStorage.setItem('dc_user_token', r.token);
        localStorage.setItem('dc_user', JSON.stringify(r.user));
        this.success.set(true);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Registration failed. Please try again.');
      },
    });
  }
}
