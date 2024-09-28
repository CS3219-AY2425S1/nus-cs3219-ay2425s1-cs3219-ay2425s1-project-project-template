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
  // filteredQuestions: Question[] = [];

  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    // gets default ordering of questions
    this.questionService.getAllQuestion().subscribe((data: any) => {
      this.questions = data.data.data;
    }, (error) => {
      console.error('Error fetching: ', error);
    })
  }

  loadSortedQuestions() {
    this.questionService.getAllQuestionSorted("question_title", "asc").subscribe((data: any) => {
      this.questions = data.data.data;
    }, (error) => {
      console.error('Error fetching: ', error);
    })
  }

  loadFilteredQuestions(filterBy?: string, filterValues?: string) {
    this.questionService.getFilteredQuestions(filterBy, filterValues).subscribe((data: any) => {
      this.questions = data.data.data;
      // this.filteredQuestions = data.data.data;
    }, (error) => {
      console.error('Error fetching: ', error);
    })
  }

  applyFilter(event: { filterBy: string, filterValues: string} ) {
    this.loadFilteredQuestions(event.filterBy, event.filterValues);
    console.log('Filtering by:', event.filterBy, event.filterValues);
  }

  refreshQuestions(hasSort?: boolean) {
    if (hasSort) {
      this.loadSortedQuestions();
    } else {
      this.loadQuestions();
    }
  }
}
