import { TestBed } from '@angular/core/testing';

import { ReclamationService } from './reclamation-service.service';

describe('ReclamationServiceService', () => {
  let service: ReclamationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReclamationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
