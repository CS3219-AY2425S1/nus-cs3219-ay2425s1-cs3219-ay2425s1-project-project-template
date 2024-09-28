import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchAndFilterComponent } from '../search-and-filter/search-and-filter.component';
import { Question } from '../../app/models/question.model';
import { QuestionBoxComponent } from '../question-box/question-box.component';
import {QuestionService} from "../../services/question.service";


@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, SearchAndFilterComponent, QuestionBoxComponent],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent implements OnInit {

  questions: Question[] = [];

  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getAllQuestion().subscribe((data: any) => {
      this.questions = data.data.data;
    }, (error) => {
      console.error('Error fetching: ', error);
    })
  }
}
