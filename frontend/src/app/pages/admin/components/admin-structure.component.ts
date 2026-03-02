import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOGAN_CONSULT_TEAMS } from '../../../core/data/dogan-consult-org-structure';

@Component({
  selector: 'admin-structure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-2">Dogan Consult — Company structure</h2>
      <p class="text-th-text-3 text-sm">Teams used for lead assignment and internal representation.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      @for (t of teams; track t.value) {
        @if (t.value !== 'other') {
          <div class="bg-th-card border border-th-border rounded-xl p-5">
            <p class="font-semibold text-gold">{{ t.labelEn }}</p>
            <p class="text-th-text-3 text-sm mt-0.5">{{ t.labelAr }}</p>
            @if (t.descriptionEn) {
              <p class="text-th-text-3 text-xs mt-2">{{ t.descriptionEn }}</p>
            }
          </div>
        }
      }
    </div>
  `,
})
export class AdminStructureComponent {
  readonly teams = DOGAN_CONSULT_TEAMS;
}
