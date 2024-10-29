import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { routes } from './app.routes';
import { firebaseConfig } from '../../config/firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
  ],
};
