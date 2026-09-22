import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnloading } from './add-unloading';

describe('AddUnloading', () => {
  let component: AddUnloading;
  let fixture: ComponentFixture<AddUnloading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnloading],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUnloading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
