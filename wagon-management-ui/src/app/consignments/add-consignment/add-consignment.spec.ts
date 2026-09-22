import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsignment } from './add-consignment';

describe('AddConsignment', () => {
  let component: AddConsignment;
  let fixture: ComponentFixture<AddConsignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsignment],
    }).compileComponents();

    fixture = TestBed.createComponent(AddConsignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
