import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { MatTooltip } from '@angular/material/tooltip';
import { FingerprintService } from './services/fingetprint.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private auth = inject(AuthService);
  private theme = inject(ThemeService);

  user = null;
  // user = this.auth.user; // Signal<User | null>
  currentTheme = this.theme.theme; // Signal<'light' | 'dark'>

  constructor(private fingerprintService: FingerprintService) {
  }

  ngOnInit() {
    this.fingerprintService.getDeviceInfo().then(info => {
      console.log('Device Info:', info);
    });
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  login() {
    // this.auth.loginWithGoogle(); // Можно расширить на Yandex/Email
  }

  logout() {
    // this.auth.logout();
  }
}
