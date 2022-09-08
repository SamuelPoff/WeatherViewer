import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
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
import { MathUtils } from 'three';

import Sun from "../objects/Sun";
import Cloud from '../objects/Cloud';

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
  @Input() public farClippingPlane: number = 1000;

  public camera!: Three.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  private textureLoader = new Three.TextureLoader();
  private boxGeometry = new Three.BoxGeometry(1, 1, 1);
  private basicWireframeMat = new Three.MeshPhongMaterial({side: Three.FrontSide, color: 0x000000, polygonOffset: true, polygonOffsetUnits: 1, polygonOffsetFactor: 1});
  
  private ambientLight = new Three.AmbientLight(0xFFFFFF);

  private renderer!: Three.WebGLRenderer;
  private scene!: Three.Scene;

  private sun?: Sun;
  private cloud?: Cloud;

  private totalElapsedTime: number = 0;
  private deltaTime: number = 0;

  private lastTime?: DOMHighResTimeStamp;

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

  private createScene() {

    //Setup Scene
    this.scene = new Three.Scene();
    this.scene.background = new Three.Color(0x000000);

    //Create objects/actors, but whatever I called them objects which in retrospect was VERY vague but this is a small project so should be ok.
    this.sun = new Sun(40, 50, 12, this.basicWireframeMat, this.scene);
    this.cloud = new Cloud(5, this.basicWireframeMat, this.scene);

    let gridHelper = new Three.GridHelper(400, 100);
    this.scene.add(gridHelper);

    //Initialize Lighting
    this.scene.add(this.ambientLight);
    

    //Initialize camera
    let aspectRatio = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new Three.PerspectiveCamera(this.FOV, aspectRatio, this.nearClippingPlane, this.farClippingPlane);
    this.camera.position.z = this.cameraZ;

    this.camera.rotation.x = -1.55;
    this.camera.rotation.y = 1.55;
    this.camera.rotation.z = 1.55;

    this.camera.position.x  = 50;
    this.camera.position.y = 10;
    this.camera.position.z = 0;

  }

  private startRenderingLoop(){

    this.renderer = new Three.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    //Instaniate orbit controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

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
        component.deltaTime = dt
        component.totalElapsedTime += dt;

        component.lastTime = currentTime;

      }

      console.log(Math.floor(component.totalElapsedTime / 1000));

      if(Math.floor(component.totalElapsedTime / 1000) % 2 == 0){
        //component.spawnRaindrop();
        console.log("Raindrop spawned");
      }

      if(component.sun){
        component.sun.Animate(component.totalElapsedTime, component.deltaTime);
      }

      component.renderer.render(component.scene, component.camera);

      requestAnimationFrame(render);

      
      
    }());

  }

  ngAfterViewInit(): void{
    this.createScene();
    this.startRenderingLoop();
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


