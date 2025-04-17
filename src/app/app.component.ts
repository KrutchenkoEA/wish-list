import { RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatIcon, MatIconButton, MatToolbar, MatTooltip],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private theme = inject(ThemeService);
  currentTheme = this.theme.theme; // Signal<'light' | 'dark'>

  toggleTheme() {
    this.theme.toggleTheme();
  }
}

