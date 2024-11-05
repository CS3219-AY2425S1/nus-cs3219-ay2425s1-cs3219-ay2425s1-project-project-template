import { Component } from '@angular/core';
import { authService } from '../authService/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  id: string | null = null
  userName: string | null = null
  email: string | null = null
  matches: {
    question_id: string,
    question_title: string,
    question_complexity: string,
    question_description: string,
    question_categories: string[],
    dateTime: string
  }[] = []

  constructor(private authService: authService) {}

  //Check if username is logged in, set this.userName
  ngOnInit(): void {
    this.authService.currentUserValue.subscribe((user) => {
      if (user) {
        const {username, email, id, matches} = user.data;
        this.userName = username
        this.email = email
        this.id = id
        this.matches = matches
      }
    })
  }

}
