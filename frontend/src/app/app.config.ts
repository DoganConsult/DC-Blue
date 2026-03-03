import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/design-system/patterns/error-boundaries';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    provideHttpClient(),
    provideAnimations(),
    provideEchartsCore({ echarts }),
    providePrimeNG({ ripple: true, inputStyle: 'outlined' }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
