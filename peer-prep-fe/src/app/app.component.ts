import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { QuestionListComponent } from '../components/question-list/question-list.component';

const MODULES = [
  CommonModule,
  RouterOutlet,
  HomeComponent,
  LoginComponent,
  RouterLink,
  FormsModule,
  QuestionListComponent,
  CommonModule
];
@Component({
  selector: 'app-root',
  standalone: true,
  imports: MODULES,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'peer-prep-fe'
}
