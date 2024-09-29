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
          useValue: {
            question_id: '123',
            question_title: 'Mock Title',
            question_complexity: 'Easy',
            question_description: 'Test Description',
            question_categories: [],
          }
        },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBoxComponent);
    component = fixture.componentInstance;

    component.question = {
      question_id: '123',
      question_title: 'Mock Title',
      question_complexity: 'Easy',
      question_description: 'Test Description',
      question_categories: [],
    } as Question;
    component.index = 0;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
