import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseWagon } from './release-wagon';

describe('ReleaseWagon', () => {
  let component: ReleaseWagon;
  let fixture: ComponentFixture<ReleaseWagon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseWagon],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseWagon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
