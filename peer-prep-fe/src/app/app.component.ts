import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms'; 

const MODULES = [
  CommonModule,
  RouterOutlet,
  HomeComponent,
  LoginComponent,
  DashboardComponent,
  RouterLink,
  FormsModule
];
@Component({
  selector: 'app-root',
  standalone: true,
  imports: MODULES,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'peer-prep-fe'
}
