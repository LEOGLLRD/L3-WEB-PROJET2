import { TestBed } from '@angular/core/testing';

import { AstuceService } from './astuce.service';

describe('AstuceService', () => {
  let service: AstuceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AstuceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
