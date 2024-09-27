import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {QuestionService} from "../services/question.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf
  ],
  styleUrl: './edit-page.component.css'
})
export class EditPageComponent implements OnInit {
  questionTitle: string= '';
  questionId: string = '';
  questionDescription: string = '';
  categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Database', selected: false},
    {name: 'Shell', selected: false},
    {name: 'Concurrency', selected: false},
    {name: 'JavaScript', selected: false},
    {name: 'pandas', selected: false},
  ];
  difficulty: string = '';
  dropdownOpen: boolean = false;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.questionId = '66f2a8a8aea02b6b4babc749';
      this.loadQuestionData();
    });
  }

  loadQuestionData() {
    this.questionService.getQuestion(this.questionId).subscribe((data: any) => {
      this.questionTitle = data.title;
      this.questionDescription = data.description;
      this.categories.forEach(cat => {
        cat.selected = data.categories.includes(cat.name);
      });
      this.difficulty = data.difficulty;
    });
  }

  setDifficulty(level: string) {
    this.difficulty = level;
  }

  saveQuestion() {
    const updatedQuestion = {
      title: this.questionTitle,
      description: this.questionDescription,
      categories: this.categories.filter(cat => cat.selected).map(cat => cat.name),
      difficulty: this.difficulty
    };
    this.questionService.updateQuestion(this.questionId, updatedQuestion).subscribe((response) => {
        alert('Question updated successfully!');
      },
      (error) => {
        alert('Error updating question');
      }
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToList() {
    this.router.navigate(['/list-of-questions']);
  }
}

