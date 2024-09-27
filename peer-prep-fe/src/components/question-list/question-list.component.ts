import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchAndFilterComponent } from '../search-and-filter/search-and-filter.component';
import { Question } from '../../app/models/question.model'; 
import { QuestionBoxComponent } from '../question-box/question-box.component';


@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, SearchAndFilterComponent, QuestionBoxComponent],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent implements OnInit {

  questions: Question[] = [
    { title: 'Valid Parantheses', difficulty: 'Easy' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy' },
    { title: 'Implement Stack Using Queues', difficulty: 'Easy' },
    { title: 'Remove Element', difficulty: 'Easy' },
    { title: 'Find The Index Of The First Occurrence In A String', difficulty: 'Easy' },
    { title: 'Divide Two Integers', difficulty: 'Medium' },
    { title: 'Generate Parentheses', difficulty: 'Medium' },
    { title: 'Swap Nodes In Pairs', difficulty: 'Medium' },
    { title: 'Merge K Sorted Lists', difficulty: 'Hard' },
    { title: 'Reverse Nodes In K-Group', difficulty: 'Hard' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
