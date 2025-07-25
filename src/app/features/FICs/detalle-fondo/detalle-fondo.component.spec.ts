import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFondoComponent } from './detalle-fondo.component';

describe('DetalleFondoComponent', () => {
  let component: DetalleFondoComponent;
  let fixture: ComponentFixture<DetalleFondoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleFondoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFondoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
