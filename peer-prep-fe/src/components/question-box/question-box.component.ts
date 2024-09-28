import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Question } from '../../app/models/question.model';
import { CommonModule } from '@angular/common';
import { QuestionDescriptionComponent } from '../question-description/question-description.component';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {EditPageComponent} from "../../edit-page/edit-page.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-question-box',
  standalone: true,
  imports: [CommonModule, QuestionDescriptionComponent, MatDialogModule],
  templateUrl: './question-box.component.html',
  styleUrls: ['./question-box.component.css'],
})

export class QuestionBoxComponent {
  @Input() question!: Question;
  @Input() index!: number;
  @Output() refresh = new EventEmitter<void>();

 constructor(private dialog: MatDialog) {}

  openModal() {
    this.dialog.open(QuestionDescriptionComponent, {
      data: {
        questionTitle: this.question.question_title,
        questionDifficulty: this.question.question_complexity,
        questionDescription: this.question.question_description
      },
      panelClass: 'custom-modalbox',
      width: '400px'

    });
  }

  openEditModal() {
   const dialogRef = this.dialog.open(EditPageComponent, {
     data: {
       questionId: this.question.question_id,
     },
     panelClass: 'custom-modalbox',
     width: '800px',
     height: '600px',
     position: {
       top: '200px',
     },
     disableClose: true
   });

   dialogRef.componentInstance.editComplete.subscribe(() => {
     this.refresh.emit();
   });
  }
}

