import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionViewRendererComponent } from './question-view-renderer.component';

describe('QuestionViewRendererComponent', () => {
  let component: QuestionViewRendererComponent;
  let fixture: ComponentFixture<QuestionViewRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionViewRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionViewRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
