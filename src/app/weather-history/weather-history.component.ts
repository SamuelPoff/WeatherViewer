import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../weather.service';

import { Options } from "ngx-google-places-autocomplete/objects/options/options";
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-weather-history',
  templateUrl: './weather-history.component.html',
  styleUrls: ['./weather-history.component.scss']
})
export class WeatherHistoryComponent implements OnInit {

  constructor(private weatherService : WeatherService) { }

  options: Options = new Options({types: ['locality']});
  historicalWeatherForecast: any;

  ngOnInit(): void {
  }

  getHistoricalWeather(location: string, historicalDate: string, units? : string){

    this.weatherService.getHistoricalWeather(location, historicalDate).subscribe((res: any)=>{

      this.historicalWeatherForecast = res.forecast.forecastday[0];
      console.log(res);
      
    });

  }


}
