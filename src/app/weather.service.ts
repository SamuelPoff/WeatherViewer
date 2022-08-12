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

  baseUrl: string = "http://api.weatherstack.com/";
  currentWeatherUrl: string = "/current";
  accessKey: string = "?access_key=" + environment.weatherstackApiKey;

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string, unit? : string): Observable<CurrentWeatherResponse>{

    let url = this.baseUrl + this.currentWeatherUrl + this.accessKey + "&query=" + location
    if(unit){
      url += `&units=${unit}`;
    }

    console.log(unit);
    console.log(url);
    return this.http.get<CurrentWeatherResponse>(url);

  }

  getHistoricalWeather(){



  }

}
