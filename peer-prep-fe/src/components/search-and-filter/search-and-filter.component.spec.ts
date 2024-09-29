import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchAndFilterComponent } from './search-and-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import this to handle HttpClient
import { ReactiveFormsModule } from '@angular/forms'; // Import if your component uses reactive forms

describe('SearchAndFilterComponent', () => {
  let component: SearchAndFilterComponent;
  let fixture: ComponentFixture<SearchAndFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchAndFilterComponent], // Components go here, not in imports
      imports: [HttpClientTestingModule, ReactiveFormsModule] // Add any necessary modules, such as HttpClientTestingModule
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAndFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
