import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUsSectionComponent } from './join-us-section.component';

describe('JoinUsSectionComponent', () => {
  let component: JoinUsSectionComponent;
  let fixture: ComponentFixture<JoinUsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinUsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinUsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
