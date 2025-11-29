import { TestBed } from '@angular/core/testing';

import { StudentRequestsService } from './student-requests.service';

describe('StudentRequestsService', () => {
  let service: StudentRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
