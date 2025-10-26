import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicsComponent } from './fics.component';

describe('FicsComponent', () => {
  let component: FicsComponent;
  let fixture: ComponentFixture<FicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
