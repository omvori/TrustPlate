import { TestBed } from '@angular/core/testing';

import { FlaskServer } from './flask-server';

describe('FlaskServer', () => {
  let service: FlaskServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaskServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
