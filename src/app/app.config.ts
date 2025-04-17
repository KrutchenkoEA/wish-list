import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: 'kr-wish-list-app',
      appId: '1:958363621379:web:7e7cad49dc8e8b988e9636',
      storageBucket: 'kr-wish-list-app.firebasestorage.app',
      apiKey: 'AIzaSyDY098Zchcs8F56ITo5zvszcc_deJXt48g',
      authDomain: 'kr-wish-list-app.firebaseapp.com',
      messagingSenderId: '958363621379',
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
};
