import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCardComponent } from './input-card';

describe('InputCard', () => {
  let component: InputCardComponent;
  let fixture: ComponentFixture<InputCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
