import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {WeatherService} from "../weather.service";
import { PlacesAutocompleteService } from '../places-autocomplete.service';
import { enableDebugTools } from '@angular/platform-browser';

import {CurrentWeatherData} from "../interfaces/CurrentWeatherData";

import { Options } from "ngx-google-places-autocomplete/objects/options/options";
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  weatherData: any[] = [];
  options: Options = new Options({types: ['locality']});
  unit: string = "c";

  currentWeatherData?: CurrentWeatherData;

  constructor(private http: HttpClient, private weatherService: WeatherService, private placesService: PlacesAutocompleteService) { }

  ngOnInit(): void {}

  getCurrentWeather(location: string, units: string){

    this.weatherService.getCurrentWeather(location, units).subscribe((res: any)=>{

      console.log(res);
      this.weatherData.push(res.current);

    });

  }

  addressChange(address: Address, units: string){
    
    console.log("Units: " + units);
    this.getCurrentWeather(address.formatted_address, this.unit);

  }

  onUnitChange(value: string){

    this.unit = value;
    console.log(this.unit);

  }

}


