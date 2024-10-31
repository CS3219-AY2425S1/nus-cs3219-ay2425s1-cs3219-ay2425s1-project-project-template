import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabPageComponent } from './collab-page.component';

describe('CollabPageComponent', () => {
  let component: CollabPageComponent;
  let fixture: ComponentFixture<CollabPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollabPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
