import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { WeatherHistoryComponent } from './weather-history/weather-history.component';
import { CurrentWeatherViewComponent } from './current-weather-view/current-weather-view.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WeatherHistoryComponent,
    CurrentWeatherViewComponent,
    WeatherForecastComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GooglePlaceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
