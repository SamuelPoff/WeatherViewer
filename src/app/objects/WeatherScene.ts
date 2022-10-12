import * as Three from "three";

import WeatherData from "./WeatherData";

import Sun from "./Sun";
import Terrain from "./Terrain";
import Cloud from './Cloud';
import Rain from './Rain';
import Snow from './Snow';

import Animatable from "../interfaces/Animatable";

import {CreateGradientShader} from "./Shaders";
import {GetWeatherCondition, WeatherCondition, WeatherType, WeatherStrength} from "../utils/WeatherConditionUtil";

import ObjectPool from "./ObjectPool";
import { Vector3 } from "three";

//Encapsulate three js scene handling into one spot
//Handle the composition of the scene based on weather information
class WeatherScene{

    private scene: Three.Scene;
    private animatables: Array<Animatable> = [];

    private gradientMaterial! : Three.Material;
    private terrainMaterial = new Three.MeshStandardMaterial({side: Three.FrontSide, color: 0x261a46, polygonOffset: true, polygonOffsetUnits: 1, polygonOffsetFactor: 1, metalness:0.05, roughness: 0.6});
    
    light = new Three.AmbientLight(new Three.Color(0xffffff), 0.75);
    pointLight: Three.PointLight = new Three.PointLight(new Three.Color(0xe92908), 1, 1000, 2);
    otherPointLight: Three.PointLight = new Three.PointLight(new Three.Color(0xe92908), 1, 600, 2);

    sun!: Sun;
    terrain!: Terrain;

    cloudObjectPool = new ObjectPool<Cloud>(256, ()=>{return new Cloud(5, 1, this.gradientMaterial, this.scene, false, new Vector3(0, 0, 0), Math.random())});
    rainObjectPool = new ObjectPool<Rain>(256, ()=>{ return new Rain(this.gradientMaterial, this.rainDirection, this.rainSpeed) });
    snowObjectPool = new ObjectPool<Snow>(256, ()=>{ return new Snow(this.gradientMaterial, this.rainDirection, this.snowSpeed) });

    raining: boolean = true; //Wether there is rain or not
    freezing: boolean = true; //Wether that rain is snow or if its actually rain
    rainHeight = 70.0;
    rainWidth = 70.0;
    rainLength = 100.0;

    rainDirection: Three.Vector3 = new Vector3(0, -10, 1.5);
    rainSpeed: number = 1.5;
    snowSpeed: number = 0.5;
    snowScale: Vector3 = new Vector3(1.0, 1.0, 1.0);

    rainFrequency: number = 0.35;

    constructor(weatherData?: WeatherData){

        this.scene = new Three.Scene();

        const bg = new Three.TextureLoader().load("assets/vaporwaveSky.png");
        this.scene.background = bg;

        this.gradientMaterial = new Three.ShaderMaterial( CreateGradientShader(new Three.Color(0xff1572), new Three.Color(0xe92908)) );


        //Setup Terrain
        let heightmap = this.generateHeightmap(64,64);
        this.terrain = new Terrain(64, 64, this.terrainMaterial, heightmap);
        this.scene.add(this.terrain.mesh);

        //Setup Sun
        this.sun = new Sun(100, 350, 0, 1, this.gradientMaterial, this.scene);
        this.sun.enabled = false;
        this.animatables.push(this.sun);

        //Setup Lights
        this.pointLight.position.set(-250, 100, 0);
        this.otherPointLight.position.set(-250, 100, 0);

        this.scene.add(this.light);
        this.scene.add(this.pointLight);
        this.scene.add(this.otherPointLight);

        //Construct scene based on data from weatherData
        //Ex: if uv index is really high, scale the rays of the sun to be bigger and move faster
        //: spawn amount of raindrops appropriate for how much its supposed to rain

    }

    

    Animate(totalElapsedTime: number, deltaTime: number){
        this.animatables.forEach((animatable) => {

            if(animatable.enabled){
                animatable.Animate(totalElapsedTime, deltaTime);
            }

        });

        if(this.raining){

            if(Math.random() < this.rainFrequency){

                this.SpawnRain();
                
            }
        }

    }

    getScene(): Three.Scene{
        return this.scene;
    }

    //Clear the scene visually but without actually removing any children.
    Clear(){

        this.scene.children.forEach( (child)=>{
            child.visible = false;
        } );

        this.ReturnClouds();
        this.sun.ReturnSunRays();
        this.ReturnRain();
        

    }

    SpawnRain(){

        if(!this.freezing){

            let raindrop = this.rainObjectPool.Get( (instance: Rain)=>{ instance.Setup( this.rainDirection, this.rainSpeed);
            instance.mesh.position.set(-Math.random()*this.rainWidth, this.rainHeight, Math.random() * (this.rainLength*2) - this.rainLength) } );

            if(raindrop){
                this.scene.add(raindrop.mesh);
                raindrop.enabled = true;
                raindrop.mesh.visible = true;

                raindrop.onDestroy = this.rainOnDestroy;
                raindrop.onDestroyContext = this;

                //If animatables doesnt already contain this raindrop instance, add it
                if(!this.animatables.find( (value)=>{return value === raindrop} )){
                    console.log("Adding new raindrop");
                    this.animatables.push(raindrop);
                }

            }

        }
        else
        {

            let snow = this.snowObjectPool.Get( (instance: Snow)=>{ 
                instance.Setup(this.rainDirection, this.snowSpeed)
                instance.mesh.position.set(-Math.random()*this.rainWidth, this.rainHeight, Math.random() * (this.rainLength*2) - this.rainLength);
                instance.mesh.scale.set(this.snowScale.x, this.snowScale.y, this.snowScale.z);
            });

            if(snow){
                this.scene.add(snow.mesh);
                snow.enabled = true;
                snow.mesh.visible = true;

                snow.onDestroy = this.snowOnDestroy;
                snow.onDestroyContext = this;

                //If animatables doesnt already have this snowflake then add it
                if(!this.animatables.find( (value)=>{return value === snow} )){
                    console.log("Adding new snow");
                    this.animatables.push(snow);
                }
            }

        }

    }

    //Construct the current scene based on the weather data passed in.
    ConstructScene(weatherCondition: WeatherCondition){

        this.raining = false;
        this.freezing = false;

        this.rainSpeed = 1.5;
        this.snowSpeed = 0.5;

        this.snowScale.set(1.0, 1.0, 1.0);

        //Setup Sun
        let sunRays = 8;
        let strength = 1;

        switch(weatherCondition.type){
            case WeatherType.Sunny:{

                sunRays = 14;
                strength = 1.3;

                break;
            }
            case WeatherType.Cloudy:{
                
                if(weatherCondition.strength == WeatherStrength.Weak){
                    this.generateCloudCover(0.25, false, 6, 18, 24, 7, 2);
                }
                else if(weatherCondition.strength == WeatherStrength.Medium){
                    this.generateCloudCover(0.50, false, 6, 18, 23, 7, 2);
                }
                else if(weatherCondition.strength == WeatherStrength.Strong){
                    this.generateCloudCover(0.75, false, 6, 18, 22, 7, 2);
                }

                break;
            }
            case WeatherType.Rain:{

                sunRays = 0;
                strength = 0.6;

                this.raining = true;
                this.generateCloudCover(0.85, false, 6, 18, 22, 7, 2);
                
                if(weatherCondition.strength == WeatherStrength.Weak){
                    this.rainFrequency = 0.15;
                }
                else if(weatherCondition.strength == WeatherStrength.Medium){
                    this.rainFrequency = 0.25;
                }
                else if(weatherCondition.strength == WeatherStrength.Strong){
                    this.rainFrequency = 0.50;
                    this.rainSpeed = 1.7;
                }

                break;
            }
            case WeatherType.Snow:{

                this.raining = true;
                this.freezing = true;

                sunRays = 0;
                strength = 0.5;

                this.generateCloudCover(0.85, false, 6, 18, 22, 7, 2);

                if(weatherCondition.strength == WeatherStrength.Weak){
                    this.rainFrequency = 0.15;
                }
                else if(weatherCondition.strength == WeatherStrength.Medium){
                    this.rainFrequency = 0.25;
                }
                else if(weatherCondition.strength == WeatherStrength.Strong){
                    this.rainFrequency = 0.40;
                }
                else if(weatherCondition.strength == WeatherStrength.VeryStrong){
                    this.rainFrequency = 0.70;
                    this.snowSpeed = 1.4;
                    this.snowScale.set(2.0, 2.0, 2.0);
                }

                break;
            }
            case WeatherType.Hail:{
                break;
            }
            case WeatherType.Mist:{
                break;
            }
            case WeatherType.Fog:{
                break;
            }
        }

        this.sun.strength = strength;
        this.sun.SetupSunrays(sunRays);
        //enabled the proper number of sun rays here*******

        this.sun.enabled = true;
        this.sun.mesh.visible = true;
        
        //Enable terrain
        this.terrain.mesh.visible = true;

        //Enable lights
        this.pointLight.visible = true;
        this.otherPointLight.visible = true;
        this.light.visible = true;

    }

    //Generate cloud cover for the given parameters and automatically add them to the scene
    //Density: 0-1
    generateCloudCover(density: number, raining: boolean, width: number, height: number, spacing: number, heightVariance: number, scaleVariance: number){

        let cloudBaseHeight = 85;

        let halfWidth = width/2;
        let halfHeight = height/2;

        for(let x = -halfWidth; x < halfWidth; x++){
            for(let z = -halfHeight; z < halfHeight; z++){

                if(Math.random() >= 1-density){
                    let randomHeightOffset = ((Math.random() * 2) - 1) * heightVariance;
                    let randomXOffset = (Math.random() * 4) - 2;
                    let randomZOffset = (Math.random() * 4) - 2;

                    let randomScaleVariance = (Math.random() * scaleVariance * 2) - scaleVariance;

                    //Proposed usage of the objectPool
                    let cloud = this.cloudObjectPool.Get( (instance: Cloud)=>{
                        instance.enabled = true;
                        instance.mesh.position.set(x * spacing + randomXOffset, cloudBaseHeight+randomHeightOffset, z * spacing + randomZOffset);
                        instance.mesh.scale.set(instance.baseScale.x + randomScaleVariance, instance.baseScale.y + randomScaleVariance/3, instance.baseScale.z + randomScaleVariance);
                        instance.mesh.visible = true;
                    } ); 

                    if(cloud){
                        cloud.enabled = true;
                        cloud.mesh.visible = true;

                        this.animatables.push(cloud);
                    }
                }
            }
        }

    }


    //Return all clouds as available to the objectPool and disable animation for them since they will stay in animatables
    ReturnClouds(){

        let instancePool = this.cloudObjectPool.GetInstancePool();

        for(let i = 0; i < instancePool.length; ++i){
            this.cloudObjectPool.Return(i);
            instancePool[i].enabled = false;

        }

        this.animatables = this.animatables.filter((value)=>{
            return !(value instanceof Cloud);
        });

    }

    //Return all raindrops as available to the objectPool and disable animation for them
    ReturnRain(){

        let instancePool = this.rainObjectPool.GetInstancePool();

        for(let i = 0; i < instancePool.length; ++i){
            this.rainObjectPool.Return(i);
            instancePool[i].enabled = false;
        }

        this.animatables = this.animatables.filter((value)=>{
            return !(value instanceof Rain);
        });

    }

    rainOnDestroy(rain: Rain){

        rain.mesh.visible = false;
        rain.enabled = false;
        this.rainObjectPool.ReturnInst(rain);

    }

    //Return all snow to the object pool
    ReturnSnow(){

        let instancePool = this.snowObjectPool.GetInstancePool();

        for(let i = 0; i < instancePool.length; ++i){
            this.snowObjectPool.Return(i);
            instancePool[i].enabled = false;
        }

        this.animatables = this.animatables.filter( (value)=>{
            return !(value instanceof Snow);
        } )

    }

    snowOnDestroy(snow: Snow){

        snow.mesh.visible = false;
        snow.enabled = false;

        this.snowObjectPool.ReturnInst(snow);

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
                height[x + (worldWidth * y)] = Math.random() * (55*a) + 6;
            }else{
                height[x + (worldWidth * y)] = Math.random() * 5;
            }
            
          }
        }
    
        return height;
    
      }
    

}


export default WeatherScene