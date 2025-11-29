import { TestBed } from '@angular/core/testing';

import { TimeTableService } from './timetable.service';

describe('TimetableService', () => {
  let service: TimeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
