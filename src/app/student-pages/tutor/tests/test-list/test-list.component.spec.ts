import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListComponent } from './test-list.component';

describe('ExamListComponent', () => {
  let component: ExamListComponent;
  let fixture: ComponentFixture<ExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
