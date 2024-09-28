import {Component, EventEmitter, Output} from '@angular/core';
import {EditPageComponent} from "../../edit-page/edit-page.component";
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service'; 
import {MatDialog} from "@angular/material/dialog";
import {AddPageComponent} from "../../add-page/add-page.component";
import { Category } from '../../app/models/category.model';

@Component({
  selector: 'app-search-and-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-and-filter.component.html',
  styleUrl: './search-and-filter.component.css'
})
export class SearchAndFilterComponent {
  @Output() refresh = new EventEmitter<void>();
  @Output() sort = new EventEmitter<void>(); // event for when "SORT" button is clicked
  @Output() filter = new EventEmitter<{ filterBy: string, filterValues: string }>();

  categories: string[] = [];
  showFilterOptions = false;  // Controls showing filter options
  isDifficultyClicked = false;
  isCategoryClicked = false;

  constructor(private dialog: MatDialog, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questionService.getQuestionCategories().subscribe(
      (response: any) => {
        console.log('Category API response:', response);
        // Map the response to Category array
        this.categories = response.data.data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

   // Show difficulty options
  showDifficultyOptions() {
    this.isDifficultyClicked = true;
    this.isCategoryClicked = false;
  }

  // Show category options
  showCategoryOptions() {
    this.isCategoryClicked = true;
    this.isDifficultyClicked = false;
  }

  // Emit an event to filter by difficulty
  filterByDifficulty(difficulty: string) {
    console.log('Filtering by difficulty:', difficulty);
    this.filter.emit({ filterBy: 'question_complexity', filterValues: difficulty });
    this.isDifficultyClicked = false;
    this.showFilterOptions = false;
  }

  // Emit an event to filter by category
  filterByCategory(category: string) {
    console.log('Filtering by category:', category);
    this.filter.emit({ filterBy: 'question_categories', filterValues: category });
    this.isCategoryClicked = false;
    this.showFilterOptions = false;
  }

  sortQuestions() {
    console.log('Sort button clicked');
    this.sort.emit(); 
  }

  openAddModal() {
    console.log('Add button clicked');
    const dialogRef = this.dialog.open(AddPageComponent, {
      panelClass: 'custom-modalbox',
      width: '800px',
      height: '600px',
      position: {
        top: '200px',
      },
      disableClose: true
    });

    dialogRef.componentInstance.addComplete.subscribe(() => {
      this.refresh.emit();
    });
  }
}
