import { TestBed } from '@angular/core/testing';

import { BuildingCostService } from './building-cost.service';

describe('BuildingCostService', () => {
  let service: BuildingCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
