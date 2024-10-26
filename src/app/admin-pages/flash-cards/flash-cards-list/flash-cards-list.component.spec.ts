import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardsListComponent } from './flash-cards-list.component';

describe('FlashCardsListComponent', () => {
  let component: FlashCardsListComponent;
  let fixture: ComponentFixture<FlashCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashCardsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
