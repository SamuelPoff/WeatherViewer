import { Component, OnInit, Input, OnChanges } from '@angular/core';

import {GetDOW} from "../utils/DowUtil";
import {GetWeatherArt} from "../utils/WeatherConditionUtil";

@Component({
  selector: 'app-weather-data-details',
  templateUrl: './weather-data-details.component.html',
  styleUrls: ['./weather-data-details.component.scss']
})
export class WeatherDataDetailsComponent implements OnInit {

  //An individual "forecastday" object from weatherAPI
  @Input() forecastData: any;
  @Input() unit: string = "c";

  weatherSymbol?: string;
  DOW: string = "";

  max_temperature: number = 0;
  min_temperature: number = 0;
  avg_temperature: number = 0;

  constructor() { }

  ngOnInit(): void {

    this.assign_unit_dependant_values(this.unit);
    this.DOW = GetDOW(this.forecastData.date);

    this.weatherSymbol = GetWeatherArt(this.forecastData.day.condition.code);

  }

  ngOnChanges(changes: any): void {

    this.assign_unit_dependant_values(changes.unit.currentValue);

  }

  assign_unit_dependant_values(unit: string){

    if(unit == 'c'){
      this.max_temperature = this.forecastData.day.maxtemp_c;
      this.min_temperature = this.forecastData.day.mintemp_c;
      this.avg_temperature = this.forecastData.day.avgtemp_c;
    }
    else{
      this.max_temperature = this.forecastData.day.maxtemp_f;
      this.min_temperature = this.forecastData.day.mintemp_f;
      this.avg_temperature = this.forecastData.day.avgtemp_f;
    }

  }

}
