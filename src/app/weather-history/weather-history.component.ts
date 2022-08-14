import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-history',
  templateUrl: './weather-history.component.html',
  styleUrls: ['./weather-history.component.scss']
})
export class WeatherHistoryComponent implements OnInit {

  constructor(private weatherService : WeatherService) { }

  weatherData: any[] = [];

  ngOnInit(): void {
  }

  getHistoricalWeather(location: string, historicalDate: string, units? : string){

    this.weatherService.getHistoricalWeather(location, historicalDate).subscribe((res: any)=>{

      this.weatherData.push(res.forecast.forecastday[0]);
      console.log(res);
      
    });

  }


}
