import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchService } from '../services/match.service';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageComponent ],
      imports: [ HttpClientTestingModule ], // Add this
      providers: [ MatchService ]
    })
    .compileComponents();

    const fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
