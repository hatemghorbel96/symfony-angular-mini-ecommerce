import { TestBed } from '@angular/core/testing';

import { ShopformService } from './shopform.service';

describe('ShopformService', () => {
  let service: ShopformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
