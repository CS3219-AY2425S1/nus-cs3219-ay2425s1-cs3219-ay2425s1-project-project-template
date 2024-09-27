import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBoxComponent } from './question-box.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('QuestionBoxComponent', () => {
  let component: QuestionBoxComponent;
  let fixture: ComponentFixture<QuestionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBoxComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {title: 'Test Title', difficulty: 'Easy'} }, 
        { provide: MatDialogRef, useValue: {} }     
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
