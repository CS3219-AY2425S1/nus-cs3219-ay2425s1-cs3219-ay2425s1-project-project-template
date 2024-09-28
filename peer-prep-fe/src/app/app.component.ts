import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionListComponent } from '../components/question-list/question-list.component';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuestionListComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'peer-prep-fe';
}
