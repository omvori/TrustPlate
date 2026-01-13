import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaRistoranti } from './pagina-ristoranti';

describe('PaginaRistoranti', () => {
  let component: PaginaRistoranti;
  let fixture: ComponentFixture<PaginaRistoranti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaRistoranti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaRistoranti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
