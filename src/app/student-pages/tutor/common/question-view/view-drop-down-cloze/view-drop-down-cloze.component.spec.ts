import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDropDownClozeComponent } from './view-drop-down-cloze.component';

describe('ViewDropDownClozeComponent', () => {
  let component: ViewDropDownClozeComponent;
  let fixture: ComponentFixture<ViewDropDownClozeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDropDownClozeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDropDownClozeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
