import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RakeDetails } from './rake-details';

describe('RakeDetails', () => {
  let component: RakeDetails;
  let fixture: ComponentFixture<RakeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RakeDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(RakeDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
