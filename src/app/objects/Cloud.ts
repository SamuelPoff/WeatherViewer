import * as Three from "three";
import { Vector3 } from "three";

import Rain from "./Rain";
import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";

class Cloud implements Animatable{

    baseScale: Three.Vector3 = new Three.Vector3(3,1,3);

    mesh: Three.Mesh;
    wireframe: Wireframe;
    material: Three.Material;

    raining: boolean = false;

    rainDirection: Three.Vector3;
    raindrops: Rain[] = [];

    animationOffset: number = 0;
    timer: number = 0;

    constructor(radius: number, scaleOffset: number, material: Three.Material, scene: Three.Scene, raining: boolean, startingPosition? : Three.Vector3, animationOffset?: number){

        this.material = material;
        let geometry = new Three.TetrahedronGeometry(radius,2);

        this.raining = raining;
        if(animationOffset){
            this.animationOffset = animationOffset;
            console.log("Animation Offset: " + this.animationOffset);
        }

        this.timer = Math.random() * 990;

        this.baseScale.x += ((Math.random() * 3) - 1.5);
        this.baseScale.y += ((Math.random() * 2) - 1) * 0.25;
        this.baseScale.z += ((Math.random() * 3) - 1.5);

        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.scale.x = this.baseScale.x + scaleOffset;
        this.mesh.scale.y = this.baseScale.y + scaleOffset/3;
        this.mesh.scale.z = this.baseScale.z + scaleOffset;

        //this.mesh.position.y = 25;
        if(startingPosition){
            this.mesh.position.x = startingPosition.x;
            this.mesh.position.y = startingPosition.y;
            this.mesh.position.z = startingPosition.z;
        }

        //Calculate what direction the rain should fall toward using normalized vector
        let targetPos = new Three.Vector3(0, -10, -1);
        this.rainDirection = targetPos.normalize();

        this.wireframe = new Wireframe(this.mesh);
        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        let scaleOffset = (Math.sin(totalElapsedTime * 0.001 + this.animationOffset) * 0.1);
        this.mesh.scale.x = this.baseScale.x + scaleOffset;
        this.mesh.scale.y = this.baseScale.y + scaleOffset;
        this.mesh.scale.z = this.baseScale.z + scaleOffset;

        

        if(this.raining){
            this.timer += deltaTime;
            if(this.timer >= 1000){

                if(Math.random() >= 0.25){
                    this.SpawnRaindrop();
                }
                this.timer = 0;

            }

            this.raindrops.forEach((raindrop)=>{
                raindrop.Animate(totalElapsedTime, deltaTime);
            });
        }

    }

    SpawnRaindrop(){

        let raindrop = new Rain(this.material, this.rainDirection, 1.5, this);
        
        let x = ((Math.random() * 2) - 1) * 10;
        let z = ((Math.random() * 2) - 1) * 30;

        raindrop.mesh.position.x = x;
        raindrop.mesh.position.z = z;
        this.mesh.add(raindrop.mesh);

        this.raindrops.push(raindrop);

    }

    RemoveRaindrop(raindrop: Rain){

        raindrop.mesh.geometry.dispose();
        this.mesh.remove(raindrop.mesh);
        this.raindrops.splice(this.raindrops.indexOf(raindrop), 1);

        
    }

}

export default Cloud;