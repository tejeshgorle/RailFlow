import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRake } from './form-rake';

describe('FormRake', () => {
  let component: FormRake;
  let fixture: ComponentFixture<FormRake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRake],
    }).compileComponents();

    fixture = TestBed.createComponent(FormRake);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
