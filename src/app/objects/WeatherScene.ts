import * as Three from "three";

import WeatherData from "./WeatherData";

import Sun from "./Sun";
import Terrain from "./Terrain";
import Cloud from './Cloud';

import Animatable from "../interfaces/Animatable";

//Encapsulate three js scene handling into one spot
//Handle the composition of the scene based on weather information
class WeatherScene{

    private scene: Three.Scene;
    private animatables: Array<Animatable> = [];

    private material = new Three.MeshPhongMaterial({side: Three.FrontSide, color: 0x000000, polygonOffset: true, polygonOffsetUnits: 1, polygonOffsetFactor: 1});

    constructor(weatherData?: WeatherData){

        this.scene = new Three.Scene();
        this.scene.background = new Three.Color(0x000000);

        //Construct scene based on data from weatherData
        //Ex: if uv index is really high, scale the rays of the sun to be bigger and move faster
        //: spawn amount of raindrops appropriate for how much its supposed to rain

        let sun = new Sun(100, 300, 15, this.material, this.scene);
        this.animatables.push(sun);
        
        //let cloud = new Cloud(5, this.material, this.scene, new Three.Vector3(0, 40, 0));
        //this.animatables.push(cloud);

        let heightmap = this.generateHeightmap(64, 64);
        let terrain = new Terrain(64, 64, this.material, heightmap);

        this.scene.add(terrain.mesh);

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

    ConstructScene(weatherData: WeatherData){

        

    }


    generateHeightmap(worldWidth: number, worldHeight: number): number[]{

        let height: number[] = new Array<number>(worldWidth * worldHeight);
    
        for(let x = 0; x < worldWidth; x++){
          for(let y = 0; y < worldHeight; y++){
    
            let center = new Three.Vector2(worldWidth/2, worldHeight/2);
            let distance = new Three.Vector2(x,y).distanceTo(center);
    
            height[x + (worldWidth * y)] = Math.random() * 5 + ( Math.abs(Math.pow(y - (worldWidth/2), 2) * 0.04) );
          }
        }
    
        return height;
    
      }
    

}


export default WeatherScene