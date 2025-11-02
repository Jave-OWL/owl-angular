import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronosticarInversionComponent } from './pronosticar-inversion.component';

describe('PronosticarInversionComponent', () => {
  let component: PronosticarInversionComponent;
  let fixture: ComponentFixture<PronosticarInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PronosticarInversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PronosticarInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
