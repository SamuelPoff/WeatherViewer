import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {CurrentWeatherResponse, CurrentWeatherData} from "../weatherData";
import {WeatherService} from "../weather.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  

  weatherData: CurrentWeatherData[] = [];

  constructor(private http: HttpClient, private weatherService: WeatherService) { }

  ngOnInit(): void {}

  getCurrentWeather(location: string){

    this.weatherService.getCurrentWeather(location).subscribe((res: CurrentWeatherResponse)=>{

      this.weatherData.push(res.current);

    });

  }


}


