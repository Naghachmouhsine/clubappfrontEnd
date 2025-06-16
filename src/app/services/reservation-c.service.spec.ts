import { TestBed } from '@angular/core/testing';

import { ReservationCService } from './reservation-c.service';

describe('ReservationCService', () => {
  let service: ReservationCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
