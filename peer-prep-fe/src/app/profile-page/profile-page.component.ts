import { Component } from '@angular/core';
import { authService } from '../authService/authService';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from "@angular/common/http"
import {MonacoEditorModule} from 'ngx-monaco-editor-v2';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MonacoEditorModule, FormsModule, HttpClientModule],
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
    dateTime: string,
    IdInSessionDB: string
  }[] = []

  constructor(private authService: authService, private http: HttpClient) {}

  editorOptions = {
    readOnly: true,
    theme: 'vs-dark',
    language: 'javascript',
    paths: {
      vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/'
    },
    minimap: {
      enabled: false
    },
  };
  
  code: string = ''

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

  viewCode(id: string): void {
    let apiUrl: string = "http://localhost:4003/collab/code/" + id

    this.http.get<any>(apiUrl).subscribe({
      next: (data: any) => {
        console.log(data)
        this.code = data.code
      },
      error: (e) => {
        console.error(e)
      },
      complete: () =>{}
    })
  }

}
