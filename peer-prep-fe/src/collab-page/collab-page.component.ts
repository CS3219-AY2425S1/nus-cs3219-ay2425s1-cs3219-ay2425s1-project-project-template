import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collab-page',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './collab-page.component.html',
  styleUrl: './collab-page.component.css'
})
export class CollabPageComponent {
  constructor(private router: Router) {}
  navigateBack() {
    this.router.navigate(['landing']);
  }

}
