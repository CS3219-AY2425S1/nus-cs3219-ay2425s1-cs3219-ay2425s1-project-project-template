import { TestBed } from '@angular/core/testing';
import { MatchModalComponent } from './match-modal.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Import 'of' for mock observables

describe('MatchModalComponent', () => {
  let component: MatchModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchModalComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ category: 'test-category', difficulty: 'test-difficulty', userId: 'test-id', queueName: 'test-queue' })
          }
        }
      ]
    })
    .compileComponents();
    
    const fixture = TestBed.createComponent(MatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
