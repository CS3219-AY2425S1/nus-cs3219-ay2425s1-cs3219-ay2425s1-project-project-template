import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

export class authService {

  private currentUserSubject: BehaviorSubject<any>; 
  public currentUser: any;

  constructor(private router: Router) {
    const userData = sessionStorage.getItem('userData');
    this.currentUserSubject = new BehaviorSubject<any>(userData ? JSON.parse(userData) : null);
  }

  get currentUserValue() {
    return this.currentUserSubject.asObservable();
  }

  login(userData: any): void {
    sessionStorage.setItem('userData', JSON.stringify(userData));  
    this.currentUserSubject.next(userData);
    this.currentUser = userData;
    console.log(this.currentUser);
    this.router.navigate(['/']);
  }

  logout(): void {
    sessionStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userData');
  }

  isAdmin(): boolean {
    return this.currentUser.data.isAdmin;
  }
}