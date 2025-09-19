import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // Importe o AppComponent

bootstrapApplication(AppComponent, appConfig) // Use o AppComponent aqui
  .catch((err) => console.error(err));