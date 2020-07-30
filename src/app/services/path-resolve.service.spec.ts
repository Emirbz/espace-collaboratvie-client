import {TestBed} from '@angular/core/testing';

import {PathResolveService} from './path-resolve.service';

describe('PathResolveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathResolveService = TestBed.get(PathResolveService);
    expect(service).toBeTruthy();
  });
});
