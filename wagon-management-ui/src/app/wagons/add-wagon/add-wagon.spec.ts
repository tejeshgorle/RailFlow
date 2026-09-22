import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWagon } from './add-wagon';

describe('AddWagon', () => {
  let component: AddWagon;
  let fixture: ComponentFixture<AddWagon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWagon],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWagon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
