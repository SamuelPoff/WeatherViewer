import { TestBed } from '@angular/core/testing';

import { PlacesAutocompleteService } from './places-autocomplete.service';

describe('PlacesAutocompleteService', () => {
  let service: PlacesAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
