import * as Three from "three";

import WeatherData from "./WeatherData";

import Sun from "./Sun";
import Terrain from "./Terrain";
import Cloud from './Cloud';

import Animatable from "../interfaces/Animatable";

import {CreateGradientShader} from "./Shaders";

//Encapsulate three js scene handling into one spot
//Handle the composition of the scene based on weather information
class WeatherScene{

    private scene: Three.Scene;
    private animatables: Array<Animatable> = [];

    private blackMaterial = new Three.MeshBasicMaterial({side: Three.FrontSide, color: 0xaaaaaa, polygonOffset: true, polygonOffsetUnits: 1, polygonOffsetFactor: 1});
    private gradientMaterial! : Three.Material;
    private terrainMaterial = new Three.MeshStandardMaterial({side: Three.FrontSide, color: 0x261a46, polygonOffset: true, polygonOffsetUnits: 1, polygonOffsetFactor: 1, metalness:0.05, roughness: 0.6});
    light = new Three.AmbientLight(new Three.Color(0xffffff), 0.75);

    pointLight: Three.PointLight = new Three.PointLight(new Three.Color(0xe92908), 1, 1000, 2);
    otherPointLight: Three.PointLight = new Three.PointLight(new Three.Color(0xe92908), 1, 600, 2);

    constructor(weatherData?: WeatherData){

        this.scene = new Three.Scene();

        const bg = new Three.TextureLoader().load("assets/vaporwaveSky.png");
        this.scene.background = bg;

        this.gradientMaterial = new Three.ShaderMaterial( CreateGradientShader(new Three.Color(0xff1572), new Three.Color(0xe92908)) );

        this.pointLight.position.set(-250, 100, 0);
        this.otherPointLight.position.set(-250, 100, 0);

        //Construct scene based on data from weatherData
        //Ex: if uv index is really high, scale the rays of the sun to be bigger and move faster
        //: spawn amount of raindrops appropriate for how much its supposed to rain

    }

    

    Animate(totalElapsedTime: number, deltaTime: number){
        this.animatables.forEach((animatable) => {

            animatable.Animate(totalElapsedTime, deltaTime);

        });
    }

    getScene(): Three.Scene{
        return this.scene;
    }

    //Note: Find out if this also cleans up memory allocated for those objects geometry and materials
    Clear(){
        this.scene.clear();
        this.animatables = new Array<Animatable>();
    }

    //Construct the current scene based on the weather data passed in.
    ConstructScene(weatherData: WeatherData){

        let sunRays = 0;
        let strength = 1;
        if(weatherData.condition == "Sunny"){
            sunRays = 18;
            strength = 1.4;
        }
        else if(weatherData.condition == "Partly Cloudy"){
            sunRays = 16;
            strength = 0.8;
        }
        
        let sun = new Sun(100, 350, sunRays, strength, this.gradientMaterial, this.scene);
        this.animatables.push(sun);

        if(weatherData.condition == "Partly Cloudy"){
            this.generateCloudCover(0.25, false, 6, 20, 24);
        }
        else if(weatherData.condition == "Overcast"){
            this.generateCloudCover(1, true, 10, 20, 22);
        }
        

        let heightmap = this.generateHeightmap(64, 64);
        let terrain = new Terrain(64, 64, this.terrainMaterial, heightmap);

        this.scene.add(terrain.mesh);

        this.scene.add(this.light);
        this.scene.add(this.pointLight);
        this.scene.add(this.otherPointLight);

    }

    //Generate cloud cover for the given parameters and automatically add them to the scene
    //Density: 0-1
    generateCloudCover(density: number, raining: boolean, width: number, height: number, spacing: number){

        let cloudBaseHeight = 85;
        let cloudHeightVar = 5;

        let halfWidth = width/2;
        let halfHeight = height/2;

        for(let x = -halfWidth; x < halfWidth; x++){
            for(let z = -halfHeight; z < halfHeight; z++){

                if(Math.random() >= 1-density){
                    let randomHeightOffset = ((Math.random() * 2) - 1) * cloudHeightVar;
                    let randomXOffset = (Math.random() * 4) - 2;
                    let randomZOffset = (Math.random() * 4) - 2;

                    let cloud = new Cloud(5, this.blackMaterial, this.scene, raining, new Three.Vector3(x * spacing + randomXOffset, cloudBaseHeight + randomHeightOffset, z * spacing + randomZOffset), (Math.random() * 2) -1 );
                    this.animatables.push(cloud);
                }
            }
        }

    }


    //Generate the height data for the plane geometry to make the terrain look vapor-wavey
    generateHeightmap(worldWidth: number, worldHeight: number): number[]{

        let height: number[] = new Array<number>(worldWidth * worldHeight);
    
        for(let x = 0; x < worldWidth; x++){
          for(let y = 0; y < worldHeight; y++){
    
            let center = new Three.Vector2(worldWidth/2, worldHeight/2);
            let distance = new Three.Vector2(x,y).distanceTo(center);
    
            if(x <= worldHeight*0.2){
                let a = (worldHeight*0.2 - x)/(worldHeight*0.2);
                console.log(`x = ${x}  a = ${a}`);
                height[x + (worldWidth * y)] = Math.random() * (50*a) + 5;
            }else{
                height[x + (worldWidth * y)] = Math.random() * 5;
            }
            
          }
        }
    
        return height;
    
      }
    

}


export default WeatherScene