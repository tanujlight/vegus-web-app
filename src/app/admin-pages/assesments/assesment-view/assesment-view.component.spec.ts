import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentViewComponent } from './assesment-view.component';

describe('AssesmentViewComponent', () => {
  let component: AssesmentViewComponent;
  let fixture: ComponentFixture<AssesmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssesmentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
