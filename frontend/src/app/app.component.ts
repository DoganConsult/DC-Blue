import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { DrDoganCopilotComponent } from './components/dr-dogan-copilot.component';
import { ScrollToTopComponent } from './components/scroll-to-top.component';
import { CookieConsentComponent } from './components/cookie-consent.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DrDoganCopilotComponent, ScrollToTopComponent, CookieConsentComponent],
  template: `
    <div [attr.dir]="i18n.dir()" [attr.lang]="i18n.lang()" class="min-h-screen">
      <router-outlet />
      <!-- Dr. Dogan AI Copilot - Available on all pages -->
      <app-dr-dogan-copilot />
      <app-scroll-to-top />
      <app-cookie-consent />
    </div>
  `,
})
export class AppComponent implements OnInit {
  i18n = inject(I18nService);
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.i18n.setLang(this.i18n.lang());
  }
}
