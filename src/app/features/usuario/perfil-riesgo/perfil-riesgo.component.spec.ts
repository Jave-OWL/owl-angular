import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilRiesgoComponent } from './perfil-riesgo.component';

describe('PerfilRiesgoComponent', () => {
  let component: PerfilRiesgoComponent;
  let fixture: ComponentFixture<PerfilRiesgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilRiesgoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
