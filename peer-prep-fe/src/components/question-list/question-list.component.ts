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

  loadQuestions(hasSort?: boolean) {
    if (hasSort) {
      // default alphabetical sorting for now
      this.questionService.getAllQuestionSorted("question_title", "asc").subscribe((data: any) => {
        this.questions = data.data.data;
      }, (error) => {
        console.error('Error fetching: ', error);
      })
    } else {
      // gets default ordering of questions
      this.questionService.getAllQuestion().subscribe((data: any) => {
        this.questions = data.data.data;
      }, (error) => {
        console.error('Error fetching: ', error);
      })
    }
  }

  refreshQuestions(hasSort?: boolean) {
    this.loadQuestions(hasSort);
  }

  loadSearchedQuestions(searchTerm?: string) {
    if (searchTerm) {
      // default alphabetical sorting for now
      this.questionService.searchQuestion(searchTerm).subscribe((data: any) => {
        this.questions = data.data.data;
      }, (error) => {
        console.error('Error fetching: ', error);
      })
    } else {
      // gets default ordering of questions
      this.questionService.getAllQuestion().subscribe((data: any) => {
        this.questions = data.data.data;
      }, (error) => {
        console.error('Error fetching: ', error);
      })
    }
  }


  refreshQuestionsSearch(searchTerm?: string) {
    this.loadSearchedQuestions(searchTerm);
  }
}
