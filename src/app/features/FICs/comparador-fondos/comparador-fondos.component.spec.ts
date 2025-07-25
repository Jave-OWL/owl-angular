import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparadorFondosComponent } from './comparador-fondos.component';

describe('ComparadorFondosComponent', () => {
  let component: ComparadorFondosComponent;
  let fixture: ComponentFixture<ComparadorFondosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparadorFondosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparadorFondosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
