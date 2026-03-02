import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private i18n = inject(I18nService);

  private readonly brandSuffix = {
    en: ' | Saudi Business Gate',
    ar: ' | بوابة الأعمال السعودية',
  };

  update(config: {
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    ogImage?: string;
    canonical?: string;
  }): void {
    const lang = this.i18n.lang();
    const pageTitle = lang === 'ar'
      ? config.titleAr + this.brandSuffix.ar
      : config.titleEn + this.brandSuffix.en;
    const desc = lang === 'ar' ? config.descAr : config.descEn;

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'ar' ? 'ar_SA' : 'en_US' });

    if (config.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: config.ogImage });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });

    if (config.canonical && typeof document !== 'undefined') {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', config.canonical);
    }
  }

  setStructuredData(data: object): void {
    if (typeof document === 'undefined') return;
    let script = document.querySelector('script[type="application/ld+json"]#sbg-sd') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'sbg-sd';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
