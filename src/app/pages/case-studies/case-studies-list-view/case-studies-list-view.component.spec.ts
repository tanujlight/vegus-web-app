import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesListViewComponent } from './case-studies-list-view.component';

describe('CaseStudiesListViewComponent', () => {
  let component: CaseStudiesListViewComponent;
  let fixture: ComponentFixture<CaseStudiesListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseStudiesListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudiesListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
