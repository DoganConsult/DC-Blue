import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-950 text-white flex flex-col">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <a routerLink="/" class="flex items-center gap-2 text-white font-bold text-lg tracking-wide hover:opacity-80 transition">
          <span class="text-[#0EA5E9]">◈</span> Dogan Consult
        </a>
        <span class="text-gray-500 text-sm">No account? <a routerLink="/register" class="text-[#0EA5E9] hover:underline">Register</a></span>
      </div>

      <!-- Body -->
      <div class="flex-1 flex flex-col lg:flex-row">

        <!-- Left: platform options -->
        <div class="lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800 flex flex-col justify-center px-10 py-16">
          <h1 class="text-3xl font-bold mb-3">Welcome back</h1>
          <p class="text-gray-400 text-sm mb-10 leading-relaxed">
            Sign in to your account to continue where you left off.
          </p>

          <div class="space-y-4">
            <div class="flex items-start gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span class="text-2xl mt-0.5">🏢</span>
              <div>
                <p class="font-semibold text-sm">Client / Visitor</p>
                <p class="text-gray-500 text-xs mt-0.5">Track inquiries, view project status and ICT services.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span class="text-2xl mt-0.5">🤝</span>
              <div>
                <p class="font-semibold text-sm">Consulting Partner</p>
                <p class="text-gray-500 text-xs mt-0.5">Manage leads, commissions and partner pipeline.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span class="text-2xl mt-0.5">👤</span>
              <div>
                <p class="font-semibold text-sm">Team Member / Admin</p>
                <p class="text-gray-500 text-xs mt-0.5">Full dashboard — leads, AI assistant, engagements.</p>
              </div>
            </div>
          </div>

          <p class="text-gray-600 text-xs mt-10">
            Looking for the <a routerLink="/partner" class="text-[#0EA5E9] hover:underline">Partner Portal</a>
            or <a routerLink="/admin" class="text-[#0EA5E9] hover:underline">Admin Dashboard</a>?
          </p>
        </div>

        <!-- Right: login form -->
        <div class="lg:w-1/2 flex items-center justify-center px-8 py-16">
          <div class="w-full max-w-md">
            <h2 class="text-2xl font-bold mb-1">Sign in</h2>
            <p class="text-gray-500 text-sm mb-8">Use your username or email address.</p>

            <form (ngSubmit)="login()" class="space-y-4">

              <div>
                <label class="block text-gray-400 text-xs mb-1.5 font-medium">Username or Email <span class="text-red-400">*</span></label>
                <input [(ngModel)]="identifier" name="identifier" placeholder="janesmith or jane@company.com" required
                       class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
              </div>

              <div>
                <label class="block text-gray-400 text-xs mb-1.5 font-medium">Password <span class="text-red-400">*</span></label>
                <div class="relative">
                  <input [(ngModel)]="password" name="password" [type]="showPw() ? 'text' : 'password'" placeholder="Your password" required
                         class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition" />
                  <button type="button" (click)="showPw.set(!showPw())" class="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition text-xs px-1 py-0.5">
                    {{ showPw() ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              @if (error()) {
                <div class="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">{{ error() }}</div>
              }

              <button type="submit" [disabled]="loading() || !identifier.trim() || !password"
                      class="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-semibold text-sm hover:bg-[#0EA5E9]/80 transition disabled:opacity-40 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
                    Signing in...
                  </span>
                } @else {
                  Sign In
                }
              </button>

              <div class="relative flex items-center gap-3 py-2">
                <div class="flex-1 h-px bg-gray-800"></div>
                <span class="text-gray-600 text-xs">or continue with</span>
                <div class="flex-1 h-px bg-gray-800"></div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <a routerLink="/partner" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition">
                  🔑 Partner Key
                </a>
                <a routerLink="/admin" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition">
                  🛡 Admin Portal
                </a>
              </div>

              <p class="text-center text-gray-600 text-xs pt-2">
                Don't have an account? <a routerLink="/register" class="text-[#0EA5E9] hover:underline">Register here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  identifier = '';
  password = '';
  showPw = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  login() {
    if (!this.identifier.trim() || !this.password) return;
    this.loading.set(true);
    this.error.set(null);

    this.http.post<{ ok: boolean; token: string; user: any }>('/api/v1/public/auth/login', {
      identifier: this.identifier.trim(),
      password: this.password,
    }).subscribe({
      next: (r) => {
        this.loading.set(false);
        localStorage.setItem('dc_user_token', r.token);
        localStorage.setItem('dc_user', JSON.stringify(r.user));

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (r.user.role === 'admin' || r.user.role === 'employee') {
          this.router.navigate(['/admin']);
        } else if (r.user.role === 'partner') {
          this.router.navigate(['/partner']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error?.error || 'Sign in failed. Please try again.');
      },
    });
  }
}
