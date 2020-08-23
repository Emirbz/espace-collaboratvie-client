import {TestBed} from '@angular/core/testing';

import {RoomRequestService} from './room-request.service';

describe('RoomRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomRequestService = TestBed.get(RoomRequestService);
    expect(service).toBeTruthy();
  });
});
