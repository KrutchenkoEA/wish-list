import { Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminLoginDialogComponent } from './components/admin/admin-login-dialog/admin-login-dialog.component';
import { FingerprintService } from './services/fingetprint.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatIcon, MatIconButton, MatToolbar, MatTooltip],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private theme = inject(ThemeService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  fingerprintService = inject(FingerprintService);

  currentTheme = this.theme.theme;
  isAdmin = this.auth.isAdmin();

  toggleTheme() {
    this.theme.toggleTheme();
  }

  loginAsAdmin(): void {
    this.dialog.open(AdminLoginDialogComponent)
      .afterClosed()
      .subscribe(password => {
        if (!password) return;

        if (password === 'secret') {
          this.auth.enableAdminMode();
          this.router.navigate(['/admin']);
        } else {
          alert('Неверный пароль');
        }
      });
  }

  logoutAdmin(): void {
    this.auth.disableAdminMode();
    this.router.navigate(['/']);
  }
}

