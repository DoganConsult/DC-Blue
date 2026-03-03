import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { DesignSystemService } from '../core/services/design-system.service';
import { NavSectionComponent } from '../sections/nav-section.component';
import { FooterSectionComponent } from '../sections/footer-section.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavSectionComponent, FooterSectionComponent],
  template: `
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">Skip to main content</a>
    <app-nav-section (langChange)="i18n.setLang($event)" />
    <main id="main-content" [class]="ds.layout.main" class="bg-th-bg text-th-text">
      <router-outlet />
    </main>
    <app-footer-section />
  `,
})
export class AppShellComponent {
  i18n = inject(I18nService);
  ds = inject(DesignSystemService);
}
