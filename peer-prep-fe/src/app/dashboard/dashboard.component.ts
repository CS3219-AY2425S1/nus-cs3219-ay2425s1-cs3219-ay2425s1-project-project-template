import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';
import { CommonModule } from '@angular/common';

const MODULES = [CommonModule];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthGoogleService);
  private router = inject(Router);
  profile: any;
  token: any;

  ngOnInit(): void {
    this.showData();
  }

  showData() {
    this.profile = this.authService.getProfile();
    this.token = this.authService.getToken();
    console.log(this.profile);
    console.log(this.token);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
