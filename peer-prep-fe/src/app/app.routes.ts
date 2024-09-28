import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddPageComponent } from "../add-page/add-page.component";
import {EditPageComponent} from "../edit-page/edit-page.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path:'login', component: LoginComponent},
  {path: 'add-question', component: AddPageComponent},
  {path: 'edit-question', component: EditPageComponent}


export const routes: Routes = [
  {path: 'add-question', component: AddPageComponent},
  {path: 'edit-question', component: EditPageComponent}
];
