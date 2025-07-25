import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondosGuardadosComponent } from './fondos-guardados.component';

describe('FondosGuardadosComponent', () => {
  let component: FondosGuardadosComponent;
  let fixture: ComponentFixture<FondosGuardadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FondosGuardadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FondosGuardadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
