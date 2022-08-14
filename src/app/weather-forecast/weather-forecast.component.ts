import { Component, OnInit } from '@angular/core';

import { WeatherService } from "../weather.service";

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {

  forecasts: any[] = [];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  getForecast(){

    this.weatherService.getForecast("Indianapolis", 7).subscribe((res)=>{

      console.log(res);
      this.forecasts = res.forecast.forecastday;

    });

  }

}
