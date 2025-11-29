import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase())
    ),
  ],
};

export const usersUrl = 'http://localhost:3000/users';
export const courseUrl = 'http://localhost:3000/courses';

function provideZoneChangeDetection(arg0: { eventCoalescing: boolean; }): import("@angular/core").Provider | import("@angular/core").ImportedNgModuleProviders {
  throw new Error('Function not implemented.');
}
