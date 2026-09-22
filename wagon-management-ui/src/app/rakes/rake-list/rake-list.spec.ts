import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RakeList } from './rake-list';

describe('RakeList', () => {
  let component: RakeList;
  let fixture: ComponentFixture<RakeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RakeList],
    }).compileComponents();

    fixture = TestBed.createComponent(RakeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
