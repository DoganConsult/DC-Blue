import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-integrations-section',
  standalone: true,
  template: `
    <section class="py-20 px-4 bg-gray-50" id="integrations">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-brand-dark mb-2">
          {{ i18n.t('Tools & ecosystems we work with', 'الأدوات والأنظمة التي نعمل معها') }}
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {{ i18n.t('Network, cloud, monitoring, and ITSM platforms.', 'الشبكات والسحابة والمراقبة ومنصات ITSM.') }}
        </p>
        <div class="flex flex-wrap justify-center gap-6 text-gray-500 font-semibold">
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">Azure</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">AWS</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">Fortinet</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">Cisco</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">VMware</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">M365</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">GitHub</span>
          <span class="px-4 py-2 rounded-lg bg-white border border-gray-200">Zabbix</span>
        </div>
      </div>
    </section>
  `,
})
export class IntegrationsSectionComponent {
  i18n = inject(I18nService);
}
