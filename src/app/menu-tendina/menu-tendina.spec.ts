import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuTendina } from './menu-tendina';

describe('MenuTendina', () => {
  let component: MenuTendina;
  let fixture: ComponentFixture<MenuTendina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuTendina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTendina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
