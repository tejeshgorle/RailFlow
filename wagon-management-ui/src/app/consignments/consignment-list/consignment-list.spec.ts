import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentList } from './consignment-list';

describe('ConsignmentList', () => {
  let component: ConsignmentList;
  let fixture: ComponentFixture<ConsignmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsignmentList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsignmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
