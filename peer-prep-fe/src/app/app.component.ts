import { Component } from '@angular/core';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HomeComponent } from './home/home.component';

const MODULES = [
  CommonModule,
  RouterOutlet,
  HomeComponent,
  LoginComponent,
  DashboardComponent,
  RouterLinkActive,
  RouterLink,
  MatSlideToggleModule
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
=======
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'peer-prep-fe';
>>>>>>> 8806ae07732d77a0ef01cfc09179368ca7a2cb90
}
