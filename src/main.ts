import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { ThemeService } from './app/services/theme.service';

const themeService = new ThemeService();
themeService.applyTheme(themeService.theme());

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
