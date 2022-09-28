import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, Input, HostListener } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {WeatherService} from "../weather.service";
import { PlacesAutocompleteService } from '../places-autocomplete.service';
import { enableDebugTools } from '@angular/platform-browser';

import {CurrentWeatherData} from "../interfaces/CurrentWeatherData";

import { Options } from "ngx-google-places-autocomplete/objects/options/options";
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { timestamp } from 'rxjs';
import { MathUtils, Vector2 } from 'three';

import WeatherData from "../objects/WeatherData";

import WeatherScene from "../objects/WeatherScene";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {BloomPass} from "three/examples/jsm/postprocessing/BloomPass";
import {FilmPass} from "three/examples/jsm/postprocessing/FilmPass";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

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

  private weatherScene = new WeatherScene();

  effectComposer?: EffectComposer;

  private gradientMaterial!: Three.Material;

  currentWeatherData: any;
  weatherHistoryData: any[] = [];
  weatherForecastData: any[] = [];

  thelocation: string = "";

  userLatitude?: number;
  userLongitude?: number;

  options: Options = new Options({types: ['locality']});
  unit: string = "c";

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
    this.changeWeather("Sunny");

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

  }

  private startRenderingLoop(){

    this.renderer = new Three.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    //Instaniate orbit controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Instaniate and setup effect composer
    this.effectComposer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.weatherScene.getScene(), this.camera);
    this.effectComposer.addPass(renderPass);

    const bloomPass = new BloomPass(1.2);
    this.effectComposer.addPass(bloomPass);

    const filmPass = new FilmPass(0.3, 0.3, 500, 0);
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

      //Animation Loop ----
      component.weatherScene.Animate(component.totalElapsedTime, component.deltaTime);

      let scene = component.weatherScene.getScene();
      //component.renderer.render(scene, component.camera);
      component.effectComposer?.render();
      

      requestAnimationFrame(render);

      
    }());

  }

  generateHeightmap(worldWidth: number, worldHeight: number): number[]{

    let height: number[] = new Array<number>(worldWidth * worldHeight);

    for(let x = 0; x < worldWidth; x++){
      for(let y = 0; y < worldHeight; y++){

        let center = new Vector2(worldWidth/2, worldHeight/2);
        let distance = new Vector2(x,y).distanceTo(center);

        height[x + (worldWidth * y)] = Math.random() * 5 + ( Math.abs(Math.pow(y - (worldWidth/2), 2) * 0.04) );
Math.pow
      }
    }

    return height;

  }


  ngAfterViewInit(): void{
    this.createScene();
    this.startRenderingLoop();
  }


  changeWeather(weatherDescription: string){

    let weatherData = new WeatherData();
    weatherData.condition = weatherDescription;

    this.weatherScene.Clear();
    this.weatherScene.ConstructScene(weatherData);

  }


  /* Gather all weather information for current, past and future weather to display */
  getAllWeather(location: string){

    this.getCurrentWeather(location);
    this.getWeatherHistory(location);
    this.getWeatherForecast(location);

  }

  OnTemperatureUnitChange(unit: any){

    this.unit = unit;

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

  addressChange(address: Address){
    
    this.thelocation = address.formatted_address;
    this.getAllWeather(this.thelocation);

  }

  onUnitChange(value: string){

    this.unit = value;
    console.log(this.unit);

  }

}


