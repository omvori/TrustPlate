import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecensioniCards } from './recensioni-cards';

describe('RecensioniCards', () => {
  let component: RecensioniCards;
  let fixture: ComponentFixture<RecensioniCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecensioniCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecensioniCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
