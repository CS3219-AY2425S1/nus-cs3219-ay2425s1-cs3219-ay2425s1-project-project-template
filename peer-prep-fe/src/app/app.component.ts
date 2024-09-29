import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { QuestionListComponent } from '../components/question-list/question-list.component';
import { authService } from './authService/authService';

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
  userName: string | null = null;

  constructor(private authService: authService) {}

  //Check if username is logged in, set this.userName
  ngOnInit(): void {
    this.authService.currentUserValue.subscribe(user => {
      if (user) {
        this.userName = user.data.username;
      } else {
        this.userName = null; 
      }
    });
  }

  //For logout button
  logout(): void {
    this.authService.logout();
  }

  //For navbar username display
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
