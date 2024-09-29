import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchAndFilterComponent } from './search-and-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import this to handle HttpClient
import { ReactiveFormsModule } from '@angular/forms'; 

describe('SearchAndFilterComponent', () => {
  let component: SearchAndFilterComponent;
  let fixture: ComponentFixture<SearchAndFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchAndFilterComponent], // For components
      imports: [HttpClientTestingModule, ReactiveFormsModule] // For modules
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
