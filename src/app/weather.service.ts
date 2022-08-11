import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {HttpClient} from '@angular/common/http';

import {CurrentWeatherResponse, CurrentWeatherData} from "./weatherData";

/* Get weather data from weatherstack API */

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  baseUrl: string = "http://api.weatherstack.com/";
  currentWeatherUrl: string = "/current";
  accessKey: string = "?access_key=a886365f5326b34936176cec6b2a74c0";

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string): Observable<CurrentWeatherResponse>{

    return this.http.get<CurrentWeatherResponse>(this.baseUrl + this.currentWeatherUrl + this.accessKey + "&query=" + location);

  }

  getHistoricalWeather(){



  }

}
