import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
<<<<<<< HEAD
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ]
=======
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
>>>>>>> 8806ae07732d77a0ef01cfc09179368ca7a2cb90
};
