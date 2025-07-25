import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorarFondosComponent } from './explorar-fondos.component';

describe('ExplorarFondosComponent', () => {
  let component: ExplorarFondosComponent;
  let fixture: ComponentFixture<ExplorarFondosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorarFondosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorarFondosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
