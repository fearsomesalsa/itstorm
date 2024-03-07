import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule],
  template: `
    <app-header></app-header>
    <div class="wrapper">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  styles: [
    '.wrapper { margin-top: 127px; }',
    // `app-header { position: sticky; top: 0; z-index: 10; }`
  ],
})
export class LayoutComponent {
}
