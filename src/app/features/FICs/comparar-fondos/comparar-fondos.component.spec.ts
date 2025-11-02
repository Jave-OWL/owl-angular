import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararFondosComponent } from './comparar-fondos.component';

describe('CompararFondosComponent', () => {
  let component: CompararFondosComponent;
  let fixture: ComponentFixture<CompararFondosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompararFondosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompararFondosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
