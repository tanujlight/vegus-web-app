import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightTableComponent } from './highlight-table.component';

describe('HighlightTableComponent', () => {
  let component: HighlightTableComponent;
  let fixture: ComponentFixture<HighlightTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
