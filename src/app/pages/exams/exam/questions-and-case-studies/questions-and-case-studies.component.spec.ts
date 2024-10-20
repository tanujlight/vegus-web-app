import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsAndCaseStudiesComponent } from './questions-and-case-studies.component';

describe('QuestionsAndCaseStudiesComponent', () => {
  let component: QuestionsAndCaseStudiesComponent;
  let fixture: ComponentFixture<QuestionsAndCaseStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsAndCaseStudiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsAndCaseStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
