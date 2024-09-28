import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicInAnswerComponent } from './graphic-in-answer.component';

describe('GraphicInAnswerComponent', () => {
  let component: GraphicInAnswerComponent;
  let fixture: ComponentFixture<GraphicInAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicInAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicInAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
