import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, Validators, FormGroup, ReactiveFormsModule, FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {QuestionService} from "../services/question.service";

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrl: './add-page.component.css'
})
export class AddPageComponent {
  question_title: string= '';
  question_description: string = '';
  question_categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Databases', selected: false},
    {name: 'Shell', selected: false},
    {name: 'Concurrency', selected: false},
    {name: 'JavaScript', selected: false},
    {name: 'pandas', selected: false},
  ];
  question_complexity: string = 'Easy';
  dropdownOpen: boolean = false;

  questionForm : FormGroup;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      question_title: ['', Validators.required],
      question_description: ['', Validators.required],
    });
  }

  setDifficulty(level: string) {
    this.question_complexity = level;
  }

  saveQuestion() {
    if (!this.questionForm.valid) {
      this.questionForm.markAllAsTouched();
      return;
    }
    const newQuestion = {
      Question_title: this.questionForm.value.question_title,
      Question_description: this.questionForm.value.question_description,
      Question_categories: this.question_categories.filter(cat => cat.selected).map(cat => cat.name),
      Question_complexity: this.question_complexity
    };
    console.log(newQuestion);
    this.questionService.addQuestion(newQuestion).subscribe((response) => {
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
