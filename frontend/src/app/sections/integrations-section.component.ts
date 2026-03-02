import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';
import { INTEGRATION_TOOLS } from '../core/data/site-content';

@Component({
  selector: 'app-integrations-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-th-bg-alt" id="integrations">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Tools & ecosystems we work with', 'الأدوات والأنظمة التي نعمل معها') }}
        </h2>
        <p class="text-center text-th-text-2 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Network, cloud, monitoring, and ITSM platforms.', 'الشبكات والسحابة والمراقبة ومنصات ITSM.') }}
        </p>
        <div class="flex flex-wrap justify-center gap-6 text-th-text-3 font-semibold">
          @for (tool of tools; track tool.en) {
            <span class="px-4 py-2 rounded-lg bg-th-card border border-th-border">{{ i18n.t(tool.en, tool.ar) }}</span>
          }
        </div>
      </div>
    </section>
  `,
})
export class IntegrationsSectionComponent {
  i18n = inject(I18nService);
  tools = INTEGRATION_TOOLS;
}
