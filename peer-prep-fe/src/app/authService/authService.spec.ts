import { TestBed } from '@angular/core/testing';
import { authService } from './authService';
import { Router } from '@angular/router';

describe('authService', () => {
  let router: Router;

  beforeEach(() => {
    router = TestBed.inject(Router)
  })

  it('should create an instance', () => {
    expect(new authService(router)).toBeTruthy();
  });
});
