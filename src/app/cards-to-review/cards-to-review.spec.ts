import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsToReview } from './cards-to-review';

describe('CardsToReview', () => {
  let component: CardsToReview;
  let fixture: ComponentFixture<CardsToReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsToReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsToReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
