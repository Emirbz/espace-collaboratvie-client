import {TestBed} from '@angular/core/testing';

import {ToastBootsrapService} from './toast-bootsrap.service';

describe('ToastBootsrapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastBootsrapService = TestBed.get(ToastBootsrapService);
    expect(service).toBeTruthy();
  });
});
