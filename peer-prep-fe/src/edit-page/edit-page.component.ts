import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";

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
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.questionId = params['id'];
      this.loadQuestionData();
    });
  }

  loadQuestionData() {
    this.http.get(`/api/questions/$(this.questionId)`).subscribe((data: any) => {
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
    this.http.put(`/api/questions/$(this.questionId)`, updatedQuestion).subscribe((response) => {
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

