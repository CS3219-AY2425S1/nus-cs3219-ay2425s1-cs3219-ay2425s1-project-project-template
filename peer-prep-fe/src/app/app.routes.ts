import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateAccountComponent } from './create-account/create-account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path:'login', component: LoginComponent},
  {path:'create-account', component: CreateAccountComponent},
];
