import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyViewRendererComponent } from './case-study-view-renderer.component';

describe('CaseStudyViewRendererComponent', () => {
  let component: CaseStudyViewRendererComponent;
  let fixture: ComponentFixture<CaseStudyViewRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseStudyViewRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyViewRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
