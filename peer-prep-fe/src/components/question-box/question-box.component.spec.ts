import { TestBed, ComponentFixture } from '@angular/core/testing';
import { QuestionBoxComponent } from './question-box.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../../app/models/question.model';
import { of } from 'rxjs';

describe('QuestionBoxComponent', () => {
  let component: QuestionBoxComponent;
  let fixture: ComponentFixture<QuestionBoxComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    // Create a mock for MatDialog and MatDialogRef
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpy.afterClosed.and.returnValue(of(true)); // Mock afterClosed to return an observable

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy); // Mock open to return the MatDialogRef mock
    
    TestBed.configureTestingModule({
      declarations: [QuestionBoxComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy }, // Provide the mock MatDialog
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBoxComponent);
    component = fixture.componentInstance;

    // Provide mock data for question and index inputs
    component.question = {
      title: 'Mock Question Title',
      difficulty: 'Medium',
      description: 'Mock Description',
    } as Question;
    component.index = 0; // Mock index value

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open a modal with correct data when openModal is called', () => {
    component.openModal();
    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function), // The component to be opened in the dialog
      {
        data: {
          questionTitle: 'Mock Question Title',
          questionDifficulty: 'Medium',
        },
        panelClass: 'custom-modalbox',
        width: '400px',
      }
    );
  });
});
