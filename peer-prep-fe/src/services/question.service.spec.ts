import { TestBed } from '@angular/core/testing';

import { QuestionService } from './question.service';
import {HttpClientModule} from "@angular/common/http";

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [QuestionService]
    });
    service = TestBed.inject(QuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
