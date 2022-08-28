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

  currentWeatherData: any;
  weatherHistoryData: any[] = [];
  weatherForecastData: any[] = [];

  thelocation: string = "";

  userLatitude?: number;
  userLongitude?: number;

  options: Options = new Options({types: ['locality']});
  unit: string = "c";

  constructor(private http: HttpClient, private weatherService: WeatherService, private placesService: PlacesAutocompleteService) { }

  ngOnInit(): void {

    this.getUserLocation();

  }


  /* Gather all weather information for current, past and future weather to display */
  getAllWeather(location: string){

    

    this.getCurrentWeather(location);
    this.getWeatherHistory(location);
    this.getWeatherForecast(location);

  }
  

  /* Get the current weather for the given location (NOTE: current weather data is stored in different format) */
  getCurrentWeather(location: string){

    this.weatherService.getCurrentWeather( location ).subscribe((res: any)=>{

      this.currentWeatherData = res.current;

    });

  }

  /* Get weather history data across the past 7 days */
  getWeatherHistory(location: string){

    let dateTime:string = "2022-08-22";

    this.weatherService.getHistoricalWeather(location, dateTime).subscribe((res:any )=>{

      this.weatherHistoryData = res.forecast.forecastday;

    });

  }

  /* Get weather forecast for the next 7 days */
  getWeatherForecast(location: string){

    this.weatherService.getForecast(location, 7).subscribe(( res:any )=>{

      this.weatherForecastData = res.forecast.forecastday;

    });

  }

  getUserLocation(){

    console.log("Get User Location");

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: any)=>{

        if(position){
          this.userLatitude = position.coords.latitude;
          this.userLongitude = position.coords.longitude;
          console.log("Latitude: " + this.userLatitude);
          console.log("Longitude: " + this.userLongitude);

          this.getAllWeather(`${position.coords.latitude},${position.coords.longitude}`);

        }

      },
      (error) => {console.log(error)});
    }
    else{
      alert("Geolocator is not supported by browser. Cannot automatically get loction information");
    }

  }

  addressChange(address: Address, units: string){
    
    this.thelocation = address.formatted_address;
    this.getAllWeather(this.thelocation);

  }

  onUnitChange(value: string){

    this.unit = value;
    console.log(this.unit);

  }

}


