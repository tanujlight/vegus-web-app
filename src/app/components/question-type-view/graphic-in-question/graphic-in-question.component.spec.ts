import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicInQuestionComponent } from './graphic-in-question.component';

describe('GraphicInQuestionComponent', () => {
  let component: GraphicInQuestionComponent;
  let fixture: ComponentFixture<GraphicInQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicInQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicInQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
