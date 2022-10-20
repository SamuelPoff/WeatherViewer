import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {HttpClient} from '@angular/common/http';

import {CurrentWeatherData} from "./interfaces/CurrentWeatherData";

import {environment} from "../environments/environment";
import { JsonPipe } from '@angular/common';

/* Get weather data from weatherstack API */

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  baseUrl: string = "https://api.weatherapi.com/v1";

  currentWeatherUrl: string = "/current.json";
  historicalWeatherUrl: string = "/history.json";
  forecastWeatherUrl: string = "/forecast.json";

  accessKey: string = "?key=" + environment.weatherapiKey;

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string): Observable<any>{

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


  /* Some helper methods for rearranging the response data to be easier to use */
  fillCurrentWeatherData(currentWeatherRes: any, units? : string): CurrentWeatherData{

    let temp = units === 'c' ? currentWeatherRes.temp_c : currentWeatherRes.temp_f;
    let feelslike = units === 'f' ? currentWeatherRes.feelslike_c : currentWeatherRes.feelslike_f;

    let weatherData: CurrentWeatherData = JSON.parse(JSON.stringify(currentWeatherRes));

    return {
      last_updated: currentWeatherRes.last_updated,

      temp_c: currentWeatherRes.temp_c,
      temp_f: currentWeatherRes.temp_f,

      feelslike_c: currentWeatherRes.feelslike_c,
      feelslike_f: currentWeatherRes.feelslike_f,

      wind_mph: currentWeatherRes.wind_mph,
      wind_kph: currentWeatherRes.wind_kph,
      wind_degree: currentWeatherRes.wind_degree,
      wind_dir: currentWeatherRes.wind_dir,

      pressure_mb: currentWeatherRes.pressure_mb,
      pressure_in: currentWeatherRes.pressure_in,
      precip_mm: currentWeatherRes.precip_mm,
      precip_in: currentWeatherRes.precip_in,

      humidity: currentWeatherRes.humidity,
      cloud: currentWeatherRes.cloud,
      uv: currentWeatherRes.uv,

      temperature: temp,
      feelslike: feelslike
    }

  }


}
