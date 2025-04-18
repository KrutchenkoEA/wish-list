import { Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdminLoginDialogComponent } from './components/admin/admin-login-dialog/admin-login-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatIcon, MatIconButton, MatToolbar, MatTooltip, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private theme = inject(ThemeService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  currentTheme = this.theme.theme; // Signal<'light' | 'dark'>
  isAdmin = this.auth.isAdmin(); // boolean (или signal/observable, если нужно)

  toggleTheme() {
    this.theme.toggleTheme();
  }

  async loginAsAdmin() {
    const dialogRef = this.dialog.open(AdminLoginDialogComponent);
    const password = await dialogRef.afterClosed().toPromise();
    if (!password) return;

    if (password === 'secret') {
      this.auth.enableAdminMode();
      this.router.navigate(['/admin']);
    } else {
      alert('Неверный пароль');
    }
  }

  logoutAdmin() {
    this.auth.disableAdminMode();
    this.router.navigate(['/']);
  }
}

