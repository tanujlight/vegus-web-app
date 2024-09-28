import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsListViewComponent } from './questions-list-view.component';

describe('QuestionsListViewComponent', () => {
  let component: QuestionsListViewComponent;
  let fixture: ComponentFixture<QuestionsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
