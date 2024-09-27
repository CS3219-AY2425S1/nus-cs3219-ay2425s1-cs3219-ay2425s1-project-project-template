import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, Validators, FormGroup, ReactiveFormsModule, FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, Routes} from "@angular/router";

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

  questionTitle: string= '';
  questionDescription: string = '';
  categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Database', selected: false},
    {name: 'Shell', selected: false},
    {name: 'Concurrency', selected: false},
    {name: 'JavaScript', selected: false},
    {name: 'pandas', selected: false},
  ];
  difficulty: string = 'easy';
  dropdownOpen: boolean = false;

  // constructor(
  //   private http: HttpClient,
  //   private router: Router,
  //   private route: ActivatedRoute
  // ) {}
  questionForm : FormGroup;
  constructor(private fb: FormBuilder, private router : Router) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      description:['', Validators.required],
    });
  }

  // questionForm: FormGroup;
  // constructor(private router: Router, private fb: FormBuilder) {
  //   this.questionForm = this.fb.group({
  //     title: ['', Validators.required],
  //     description:['', Validators.required],
  //     categories: this.fb.array([]),
  //     difficulty: ['', Validators.required]
  //   })
  // }


  setDifficulty(level: string) {
    this.difficulty = level;
  }

  // saveQuestion() {
  //   const updatedQuestion = {
  //     title: this.questionTitle,
  //     description: this.questionDescription,
  //     categories: this.categories.filter(cat => cat.selected).map(cat => cat.name),
  //     difficulty: this.difficulty
  //   };
  //   this.http.put(`/api/questions/$(this.questionId)`, updatedQuestion).subscribe((response) => {
  //       alert('Question updated successfully!');
  //     },
  //     (error) => {
  //       alert('Error updating question');
  //     }
  //   );
  // }

  saveQuestion() {
    if (this.questionForm.valid) {
      alert("Success");
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToList() {
    this.router.navigate(['/list-of-questions']);
  }
}
