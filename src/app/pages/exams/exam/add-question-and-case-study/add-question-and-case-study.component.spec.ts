import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionAndCaseStudyComponent } from './add-question-and-case-study.component';

describe('AddQuestionAndCaseStudyComponent', () => {
  let component: AddQuestionAndCaseStudyComponent;
  let fixture: ComponentFixture<AddQuestionAndCaseStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionAndCaseStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionAndCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
