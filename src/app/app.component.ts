import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatSnackBarModule, RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
