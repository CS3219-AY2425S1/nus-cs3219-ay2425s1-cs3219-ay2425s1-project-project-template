import { bootstrapApplication } from '@angular/platform-browser';
<<<<<<< HEAD
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


=======
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

>>>>>>> 8806ae07732d77a0ef01cfc09179368ca7a2cb90
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
