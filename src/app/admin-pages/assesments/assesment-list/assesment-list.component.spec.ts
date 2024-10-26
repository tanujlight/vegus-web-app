import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentListComponent } from './assesment-list.component';

describe('AssesmentListComponent', () => {
  let component: AssesmentListComponent;
  let fixture: ComponentFixture<AssesmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssesmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
