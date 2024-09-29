import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
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
  CommonModule,
  HttpClientModule
];
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'peer-prep-fe'
}
