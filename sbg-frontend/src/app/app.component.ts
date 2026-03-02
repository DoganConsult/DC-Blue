import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SbgNavComponent } from './components/sbg-nav.component';
import { SbgFooterComponent } from './components/sbg-footer.component';
import { ScrollToTopComponent } from './components/scroll-to-top.component';
import { CookieConsentComponent } from './components/cookie-consent.component';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'sbg-root',
  standalone: true,
  imports: [RouterOutlet, SbgNavComponent, SbgFooterComponent, ScrollToTopComponent, CookieConsentComponent],
  template: `
    <sbg-nav />
    <main>
      <router-outlet />
    </main>
    <sbg-footer />
    <sbg-scroll-to-top />
    <sbg-cookie-consent />
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class AppComponent implements OnInit {
  private i18n = inject(I18nService);

  ngOnInit(): void {
    this.i18n.setLang('ar');
  }
}
