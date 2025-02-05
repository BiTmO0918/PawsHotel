import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes'; // Import the routes configuration
import { provideHttpClient } from '@angular/common/http'; // Provides HttpClient service for HTTP operations
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule for form handling
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule for animations

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Register the router with the application's routes
    provideHttpClient(), // Register HttpClient service
    importProvidersFrom(FormsModule), // Import FormsModule for template-driven forms
    importProvidersFrom(ReactiveFormsModule), // Import ReactiveFormsModule for reactive forms
    importProvidersFrom(BrowserAnimationsModule) // Import BrowserAnimationsModule for enabling animations
  ]
};
