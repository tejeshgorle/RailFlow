import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoading } from './add-loading';

describe('AddLoading', () => {
  let component: AddLoading;
  let fixture: ComponentFixture<AddLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLoading],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLoading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
