import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CurrentWeatherViewComponent } from './current-weather-view/current-weather-view.component';
import { WeatherDataDetailsComponent } from './weather-data-details/weather-data-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CurrentWeatherViewComponent,
    WeatherDataDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GooglePlaceModule,
    RouterModule.forRoot([
      {path:'dashboard', component: DashboardComponent},
      {path:'', redirectTo:'dashboard', pathMatch:'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
