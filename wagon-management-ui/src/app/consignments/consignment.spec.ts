import { TestBed } from '@angular/core/testing';

import { Consignment } from './consignment';

describe('Consignment', () => {
  let service: Consignment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Consignment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
