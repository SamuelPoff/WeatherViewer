import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {HttpClient} from '@angular/common/http';

import {CurrentWeatherResponse, CurrentWeatherData} from "./weatherData";

import {environment} from "../environments/environment";

/* Get weather data from weatherstack API */

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  baseUrl: string = "http://api.weatherapi.com/v1";

  currentWeatherUrl: string = "/current.json";
  historicalWeatherUrl: string = "/history.json";
  forecastWeatherUrl: string = "/forecast.json";

  accessKey: string = "?key=" + environment.weatherapiKey;

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string, unit? : string): Observable<any>{

    let url = this.baseUrl + this.currentWeatherUrl + this.accessKey + "&q=" + location

    return this.http.get<any>(url);

  }

  getHistoricalWeather(location: string, dateTime : string, units? : string): Observable<any>{

    let url = this.baseUrl + this.historicalWeatherUrl + this.accessKey + "&q=" + location + "&dt="+ dateTime;

    return this.http.get<any>(url);

  }

  getForecast(location: string, days: number): Observable<any>{

    let url = this.baseUrl + this.forecastWeatherUrl + this.accessKey + "&q="+location + "&days="+days;
    return this.http.get<any>(url);

  }


}
