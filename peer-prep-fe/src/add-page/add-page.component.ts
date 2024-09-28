import {Component, Inject, NgModule} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, Validators, FormGroup, ReactiveFormsModule, FormControl} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {QuestionService} from "../services/question.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {EditPageComponent} from "../edit-page/edit-page.component";

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule
  ],
  styleUrl: './add-page.component.css'
})
export class AddPageComponent {
  question_title: string= '';
  question_description: string = '';
  question_categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Arrays', selected: false},
    {name: 'Bit Manipulation', selected: false},
    {name: 'Brainteaser', selected: false},
    {name: 'Databases', selected: false},
    {name: 'Data Structures', selected: false},
    {name: 'Recursion', selected: false},
    {name: 'Strings', selected: false},
  ];
  question_complexity: string = 'Easy';
  dropdownOpen: boolean = false;

  questionForm : FormGroup;

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    this.questionService.addQuestion(newQuestion).subscribe((response) => {
        alert('Question added successfully!');
        this.dialogRef.close();
      },
      (error) => {
        alert('Error adding question');
      }
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateBack() {
    this.dialogRef.close();
  }
}
