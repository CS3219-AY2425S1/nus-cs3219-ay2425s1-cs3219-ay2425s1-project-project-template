import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborativeEditorComponent } from './collaborative-editor.component';

describe('CollaborativeEditorComponent', () => {
  let component: CollaborativeEditorComponent;
  let fixture: ComponentFixture<CollaborativeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborativeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaborativeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
