import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, Validators, FormGroup, ReactiveFormsModule, FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {QuestionService} from "../services/question.service";

@Component({
  selector: 'app-add-page',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.css'
})
export class AddPageComponent {

  question_title: string= '';
  question_description: string = '';
  question_categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Database', selected: false},
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
    }
    const newQuestion = {
      question_title: this.question_title,
      question_description: this.question_description,
      question_categories: this.question_categories.filter(cat => cat.selected).map(cat => cat.name),
      question_complexity: this.question_complexity
    };
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
