import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBoxComponent } from './question-box.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../../app/models/question.model';

describe('QuestionBoxComponent', () => {
  let component: QuestionBoxComponent;
  let fixture: ComponentFixture<QuestionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBoxComponent],
      providers: [
        { 
          provide: MAT_DIALOG_DATA, 
          useValue: { questionTitle: 'Mock Title', questionDifficulty: 'easy' } 
        },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBoxComponent);
    component = fixture.componentInstance;

    component.question = { title: 'Mock Title', difficulty: 'easy' } as Question; 
    component.index = 0; 

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
