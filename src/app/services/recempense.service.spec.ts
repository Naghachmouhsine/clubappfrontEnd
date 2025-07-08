import { TestBed } from '@angular/core/testing';

import { RecempenseService } from './recempense.service';

describe('RecempenseService', () => {
  let service: RecempenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecempenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
