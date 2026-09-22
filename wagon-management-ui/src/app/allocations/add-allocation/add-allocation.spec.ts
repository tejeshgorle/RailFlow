import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllocation } from './add-allocation';

describe('AddAllocation', () => {
  let component: AddAllocation;
  let fixture: ComponentFixture<AddAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAllocation],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAllocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
