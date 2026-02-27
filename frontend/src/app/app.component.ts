import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div [attr.dir]="i18n.dir()" [attr.lang]="i18n.lang()" class="min-h-screen bg-white">
      <router-outlet />
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(public i18n: I18nService) {}
  ngOnInit(): void {
    this.i18n.setLang(this.i18n.lang());
  }
}
