import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, Input, HostListener } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {WeatherService} from "../weather.service";
import { PlacesAutocompleteService } from '../places-autocomplete.service';

import {CurrentWeatherData} from "../interfaces/CurrentWeatherData";

import { Options } from "ngx-google-places-autocomplete/objects/options/options";
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import * as Three from "three";
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

  private plane!: Three.Mesh;
  private staticTexture!: Three.Texture;

  private transitionTimerActive: boolean = false;
  private transitionTime: number = 0.3;
  private transitionCounter: number = 0.0;


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
      
      component.renderer.clear();

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
      console.log(event.target.dataset.condition);
      this.changeWeather(event.target.dataset.condition);

      this.transitionTimerActive = true;
      this.transitionCounter = 0.0;
      this.enableOrtho = true;
    }

  }

  toggleEnable(){
    this.enableOrtho = !this.enableOrtho;
  }


  changeWeather(weatherDescription: string){

    console.log("Called change weather: " + weatherDescription);

    let weatherData = new WeatherData();
    weatherData.condition = weatherDescription;

    this.weatherScene.Clear();
    this.weatherScene.ConstructScene(weatherData);

  }

  clearWeatherScene(){
    this.weatherScene.Clear();
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

    let dateTime:string = "2022-10-4";

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


