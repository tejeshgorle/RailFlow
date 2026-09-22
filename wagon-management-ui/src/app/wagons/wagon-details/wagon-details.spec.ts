import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagonDetails } from './wagon-details';

describe('WagonDetails', () => {
  let component: WagonDetails;
  let fixture: ComponentFixture<WagonDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WagonDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(WagonDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
