import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AddPageComponent } from "../add-page/add-page.component";
import { EditPageComponent } from "../edit-page/edit-page.component";
import { QuestionListComponent } from '../components/question-list/question-list.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'create-account', component: CreateAccountComponent},
  {path: 'admin-controls', component: AdminComponent},
  {path: 'add-question', component: AddPageComponent},
  {path: 'edit-question', component: EditPageComponent},
  {path: 'question-list', component: QuestionListComponent}
];
