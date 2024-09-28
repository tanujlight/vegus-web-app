import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamViewComponent } from './exam-view.component';

describe('ExamViewComponent', () => {
  let component: ExamViewComponent;
  let fixture: ComponentFixture<ExamViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
