import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprendeComponent } from './aprende.component';

describe('AprendeComponent', () => {
  let component: AprendeComponent;
  let fixture: ComponentFixture<AprendeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprendeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
