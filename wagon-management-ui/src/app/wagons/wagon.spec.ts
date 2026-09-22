import { TestBed } from '@angular/core/testing';

import { Wagon } from './wagon';

describe('Wagon', () => {
  let service: Wagon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wagon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
