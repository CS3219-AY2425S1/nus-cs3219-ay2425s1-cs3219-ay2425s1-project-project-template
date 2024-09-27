import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { P } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';

const MODULES: any[] = [FormsModule, ReactiveFormsModule, CommonModule];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  //private authService = inject(AuthGoogleService);

  createAccountForm = new FormGroup({
    username: new FormControl('', Validators.required), 
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  // signInWithGoogle() {
  //   this.authService.login();
  // }

  createAccount() {
      let apiUrl: string = "http://localhost:3001/users";

      if (this.createAccountForm.invalid) {

      }

      fetch(apiUrl,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.createAccountForm.value)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          alert("Email/Username already exists.")
        }
      }
      return response.json(); // Parse the JSON from the response
    })
    .then(data => {
      console.log(data); // Handle the response data
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
  }
}
