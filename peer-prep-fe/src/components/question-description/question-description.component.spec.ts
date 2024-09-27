import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionDescriptionComponent } from './question-description.component';

describe('QuestionDescriptionComponent', () => {
  let component: QuestionDescriptionComponent;
  let fixture: ComponentFixture<QuestionDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionDescriptionComponent], 
      providers: [
        {
          provide: MAT_DIALOG_DATA, 
          useValue: { questionTitle: 'Sample Title', questionDifficulty: 'Easy' } 
        },
        {
          provide: MatDialogRef, 
          useValue: {} 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
