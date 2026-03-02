import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button (click)="scrollToTop()" type="button"
              aria-label="Scroll to top"
              class="fixed bottom-6 right-6 z-[1050] w-11 h-11 rounded-full bg-th-bg-inv/80 backdrop-blur-sm text-white shadow-lg hover:bg-th-bg-inv transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    }
  `,
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  visible = signal(false);
  private scrollHandler: (() => void) | null = null;

  ngOnInit() {
    this.scrollHandler = () => {
      this.visible.set(window.scrollY > 400);
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
