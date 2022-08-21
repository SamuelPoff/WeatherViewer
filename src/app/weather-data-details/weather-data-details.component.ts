import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-weather-data-details',
  templateUrl: './weather-data-details.component.html',
  styleUrls: ['./weather-data-details.component.scss']
})
export class WeatherDataDetailsComponent implements OnInit {

  //An individual "forecastday" object from weatherAPI
  @Input() forecastData: any;
  @Input() units: string = "c";

  constructor() { }

  ngOnInit(): void {



  }

  ngOnChanges(changes: any): void {



  }

}
