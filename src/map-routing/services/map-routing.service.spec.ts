import { TestBed } from '@angular/core/testing';

import { MapRoutingService } from './map-routing.service';

describe('MapRoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapRoutingService = TestBed.get(MapRoutingService);
    expect(service).toBeTruthy();
  });
});
