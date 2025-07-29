import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionTipoInversionComponent } from './seleccion-tipo-inversion.component';

describe('SeleccionTipoInversionComponent', () => {
  let component: SeleccionTipoInversionComponent;
  let fixture: ComponentFixture<SeleccionTipoInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionTipoInversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionTipoInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
