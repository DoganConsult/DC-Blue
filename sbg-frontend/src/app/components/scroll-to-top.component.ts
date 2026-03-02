import { Component, signal, HostListener } from '@angular/core';

@Component({
  selector: 'sbg-scroll-to-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button (click)="scrollTop()"
              class="fixed bottom-6 end-6 z-50 w-11 h-11 rounded-full sbg-gradient-blue text-white shadow-lg hover:opacity-90 transition-all flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    }
  `,
})
export class ScrollToTopComponent {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
