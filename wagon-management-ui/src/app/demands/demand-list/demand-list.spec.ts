import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandList } from './demand-list';

describe('DemandList', () => {
  let component: DemandList;
  let fixture: ComponentFixture<DemandList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandList],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
