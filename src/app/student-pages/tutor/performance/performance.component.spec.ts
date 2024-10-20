import {ComponentFixture, TestBed} from '@angular/core/testing'

import {TutorPerformanceComponent} from './performance.component'

describe('TutorPerformanceComponent', () => {
  let component: TutorPerformanceComponent
  let fixture: ComponentFixture<TutorPerformanceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorPerformanceComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorPerformanceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
