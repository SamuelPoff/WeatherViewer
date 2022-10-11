import { Component, OnInit, OnChanges, Input } from '@angular/core';

import {GetWeatherArt} from "../utils/WeatherConditionUtil";

@Component({
  selector: 'app-current-weather-view',
  templateUrl: './current-weather-view.component.html',
  styleUrls: ['./current-weather-view.component.scss']
})
export class CurrentWeatherViewComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() weatherData : any;
  @Input() unit : string = "c";

  temperature: number = 0;
  feelslike: number = 0;

  weatherSymbol?: string;

  ngOnInit(): void {
    this.weatherSymbol = GetWeatherArt(this.weatherData.condition.code);
  }

  ngOnChanges(changes: any){

    if(changes.unit.currentValue === "c"){
      this.temperature = this.weatherData.temp_c;
      this.feelslike = this.weatherData.feelslike_c;
    }else{
      this.temperature = this.weatherData.temp_f;
      this.feelslike = this.weatherData.feelslike_f;
    }

  }

}
