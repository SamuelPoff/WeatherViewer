import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, Input, HostListener } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {environment} from "../../environments/environment";

import {WeatherService} from "../weather.service";
import { PlacesAutocompleteService } from '../places-autocomplete.service';

import {GetWeatherCondition} from "../utils/WeatherConditionUtil";

import { Options } from "ngx-google-places-autocomplete/objects/options/options";
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import * as Three from "three";
import { combineLatestWith, Observable, timestamp, zip, zipAll, zipWith } from 'rxjs';

import WeatherScene from "../objects/WeatherScene";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {BloomPass} from "three/examples/jsm/postprocessing/BloomPass";
import {FilmPass} from "three/examples/jsm/postprocessing/FilmPass";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  isLoading: boolean = false;

  /* Three.js setup variables */
  @Input() public rotationSpeedX: number = 0.05;
  @Input() public rotationSpeedY: number = 0.02;

  @Input() public size: number = 100;
  @Input() public texture: string = "";

  @Input() public cameraZ = 30;
  @Input() public FOV: number = 75;
  @Input() public nearClippingPlane: number = 1;
  @Input() public farClippingPlane: number = 2000;

  public camera!: Three.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  private renderer!: Three.WebGLRenderer;

  private totalElapsedTime: number = 0;
  private deltaTime: number = 0;
  private lastTime?: DOMHighResTimeStamp;

  weatherScene = new WeatherScene();

  effectComposer?: EffectComposer;

  currentWeatherData: any;
  weatherHistoryData: any[] = [];
  weatherForecastData: any[] = [];

  thelocation: string = "";

  userLatitude?: number;
  userLongitude?: number;

  options: Options = new Options({types: ['locality']});
  unit: string = "c";

  private testScene: Three.Scene = new Three.Scene();
  private testOrthoCamera!: Three.OrthographicCamera;
  private enableOrtho: boolean = false;

  private staticTexture!: Three.Texture;

  private transitionTimerActive: boolean = false;
  private transitionTime: number = 0.3;
  private transitionCounter: number = 0.0;

  private fps = 60;
  private renderInterval = 1000/this.fps;
  //Note that since I have coupled rendering and update logic since the loop was already set up, that all
  //update logic will also be throttled by throttling the framerate. Should be fine for this application
  //but I see why larger operations set up a separate update and render loop

  private renderCounter = 0;

  constructor(private http: HttpClient, private weatherService: WeatherService, private placesService: PlacesAutocompleteService) { 

  }

  @HostListener('window:resize')
  onResize() {
    this.canvasRef.nativeElement.height = window.innerHeight;
    this.canvasRef.nativeElement.width = window.innerWidth;

    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
}

  ngOnInit(): void {

    this.getUserLocation();
    this.changeWeather("1147");

  }

  private createScene() {

    //Initialize camera
    let aspectRatio = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new Three.PerspectiveCamera(this.FOV, aspectRatio, this.nearClippingPlane, this.farClippingPlane);
    this.camera.position.z = this.cameraZ;

    this.camera.rotation.x = -1.55;
    this.camera.rotation.y = 1.55;
    this.camera.rotation.z = 1.55;

    this.camera.position.x  = 50;
    this.camera.position.y = 15;
    this.camera.position.z = 0;

    //Initialize Orthographic camera
    this.testOrthoCamera = new Three.OrthographicCamera(this.canvas.clientWidth / -2, this.canvas.clientWidth / 2, this.canvas.clientHeight/2, this.canvas.clientHeight/-2, 0, 100);
    this.testScene.add(this.testOrthoCamera);

    this.staticTexture = new Three.TextureLoader().load("assets/static2.jpg");
    this.staticTexture.wrapS = Three.RepeatWrapping;
    this.staticTexture.wrapT = Three.RepeatWrapping;

    this.staticTexture.repeat.x = 5;
    this.staticTexture.repeat.y = 5;
    this.testScene.add(new Three.AmbientLight(new Three.Color(0xffffff), 100));
    let plane = new Three.Mesh(new Three.PlaneGeometry(this.canvas.clientWidth, this.canvas.clientHeight, 1, 1), new Three.MeshBasicMaterial( {map: this.staticTexture} ));

    plane.position.set(0, 0, -1);
    this.testScene.add(plane);

  }

  private startRenderingLoop(){

    this.renderer = new Three.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.autoClear = false;

    //Instaniate and setup effect composer
    this.effectComposer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.weatherScene.getScene(), this.camera);
    this.effectComposer.addPass(renderPass);

    const bloomPass = new BloomPass(1.2);
    this.effectComposer.addPass(bloomPass);

    const filmPass = new FilmPass(0.3, 0.2, 300, 0);
    this.effectComposer.addPass(filmPass);

    this.camera.rotation.x = -1.55;
    this.camera.rotation.y = 1.55;
    this.camera.rotation.z = 1.55;

    let component: DashboardComponent = this;
    (function render(currentTime?: DOMHighResTimeStamp){

      //Calculate time information
      if(currentTime){
        if(!component.lastTime){
          component.lastTime = currentTime;
        }

        let dt = currentTime - component.lastTime;
        component.deltaTime = dt;
        component.totalElapsedTime += dt;

        component.lastTime = currentTime;

      }

      component.renderCounter += component.deltaTime;

      //Check for time since last render
      if(component.renderCounter >= component.renderInterval) {
      
      component.renderer.clear();

      //Animation Loop ----
      component.weatherScene.Animate(component.totalElapsedTime, component.deltaTime);
      
      //Somewhat test code. Mainly just allows for toggling of a fullscreen texture, and since when the texture is enabled it covers the whole screen
      //I dont really need to render the rest of the scene under it so its a one-or-the-other kind of thing
      if(component.enableOrtho){

        component.renderer.clearDepth();

        component.staticTexture.offset.x = Math.random();
        component.staticTexture.offset.y = Math.random();

        component.renderer.render(component.testScene, component.testOrthoCamera);

      }else{

        component.effectComposer?.render();

      }

      component.renderCounter = 0;

      }


      //Pseudo Update code----
      if(component.transitionTimerActive){
        if(component.transitionCounter >= component.transitionTime){
          component.enableOrtho = false;
          component.transitionTimerActive = false;
          component.transitionCounter = 0.0;
        }else{
          component.transitionCounter += component.deltaTime/1000;
        }
      }

      requestAnimationFrame(render);

      
    }());

  }


  ngAfterViewInit(): void{
    this.createScene();
    this.startRenderingLoop();
  }


  onMouseOver(event: any){

    if(event.target.dataset.condition){
      
      this.changeWeather(event.target.dataset.condition);

      this.transitionTimerActive = true;
      this.transitionCounter = 0.0;
      this.enableOrtho = true;
    }

  }


  //Clears WeatherScene and calls ConstructScene with the condition code from WeatherAPI
  changeWeather(weatherConditionCode: string){

    this.weatherScene.Clear();

    let code = parseInt(weatherConditionCode);
    const weatherCondition = GetWeatherCondition(code);
    
    this.weatherScene.ConstructScene(weatherCondition);

  }


  /* Gather all weather information for current, past and future weather to display 
     Checks for cached weather data, and caches weather data that is out of date or has not previously been cached*/
  getAllWeather(location: string){

    //Check for cached data----
    const cachedWeatherData = this.GetCachedWeatherData(location);
    if(cachedWeatherData){
      console.log(`Cached Weather Data: ${cachedWeatherData}`);
      console.log(cachedWeatherData);

      this.SetAllWeatherData(cachedWeatherData.current, cachedWeatherData.history, cachedWeatherData.forecast);
      return;

    }

    this.isLoading = true;

    this.currentWeatherData = null;
    this.weatherHistoryData = new Array<any>;
    this.weatherForecastData = new Array<any>;

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dateTime = yesterday.toISOString().slice(0, 10);

    const currentWeather$ = this.weatherService.getCurrentWeather(location);
    const weatherHistory$ = this.weatherService.getHistoricalWeather(location, dateTime);
    const weatherForecast$ = this.weatherService.getForecast(location, 8);

    currentWeather$.pipe(
      combineLatestWith(weatherHistory$, weatherForecast$)
    ).subscribe( ([current, history, forecast])=>{

      this.SetAllWeatherData(current, history, forecast);
      this.isLoading = false;

      this.CacheWeatherData(location, current, history, forecast);

    }, (error)=>{console.log(`Error while pulling weather data: `); console.log(error)} );

  }

  //Store the current weather information in local storage with a unix timestamp of when it was created
  CacheWeatherData(location: string, currentWeather: any, weatherHistory: any, weatherForecast: any){

    let weatherData = {current: currentWeather, history: weatherHistory, forecast: weatherForecast, time: Date.now()}
    localStorage.setItem(location, JSON.stringify(weatherData));

  }

  //Attempt to retrieve stored weather data about a location from local storage
  //return null if thr location does exist or if thr location does exist but its timestamp is out of a particular range
  GetCachedWeatherData(location: string): any | null{

    const weatherDataString = localStorage.getItem(location);
    if(weatherDataString){

      const weatherData = JSON.parse(weatherDataString);
      if(Date.now() - weatherData.time >= environment.cacheTimeout){

        //Weather data is outdated, remove it
        localStorage.removeItem(location);
        console.log("Removing out-of-date cached weather");
        return null;

      }

      //Weather data was not outdated yet, return it
      console.log(`Cached Weather Data found for: ${location}`);
      return weatherData;

    }
    
    return null;

  }


  //Properly set currentWeatherData, weatherHistoryData, weatherForecastData with the response data from WeatherAPI
  SetAllWeatherData(current: any, history: any, forecast: any){

    this.currentWeatherData = current.current;
    this.weatherHistoryData = history.forecast.forecastday;
    this.weatherForecastData = forecast.forecast.forecastday;

  }


  

  getUserLocation(){

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


  OnTemperatureUnitChange(unit: any){

    this.unit = unit;

  }



  addressChange(address: Address){
    
    this.thelocation = address.formatted_address;
    this.getAllWeather(this.thelocation);

  }


  
  onUnitChange(value: string){

    this.unit = value;
    console.log(this.unit);

  }

}


