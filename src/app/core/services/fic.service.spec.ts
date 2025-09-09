import { TestBed } from '@angular/core/testing';

import { FICService } from './fic.service';

describe('FICService', () => {
  let service: FICService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FICService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
