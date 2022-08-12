import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlacesAutocompleteService {

  baseUrl: string = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  constructor(private http: HttpClient) { }

  getCitiesAutocomplete(input: string): Observable<any>{

    let url: string = `${this.baseUrl}?input=${input}&types=%28cities%29&key=${environment.placesApiKey}`;
    return this.http.get<any>(url);

  }

}
