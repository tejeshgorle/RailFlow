import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagonList } from './wagon-list';

describe('WagonList', () => {
  let component: WagonList;
  let fixture: ComponentFixture<WagonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WagonList],
    }).compileComponents();

    fixture = TestBed.createComponent(WagonList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
