import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDetails } from './demand-details';

describe('DemandDetails', () => {
  let component: DemandDetails;
  let fixture: ComponentFixture<DemandDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
