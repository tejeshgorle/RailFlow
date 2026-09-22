import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentDetails } from './consignment-details';

describe('ConsignmentDetails', () => {
  let component: ConsignmentDetails;
  let fixture: ComponentFixture<ConsignmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsignmentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsignmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
