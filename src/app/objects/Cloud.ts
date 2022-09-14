import * as Three from "three";
import { Vector3 } from "three";

import Rain from "./Rain";
import Wireframe from "./Wireframe";

class Cloud{

    static baseScale: Three.Vector3 = new Three.Vector3(2,1,2);

    mesh: Three.Mesh;
    wireframe: Wireframe;
    material: Three.Material;

    rainDirection: Three.Vector3;
    raindrops: Rain[] = [];

    constructor(radius: number, material: Three.MeshBasicMaterial, scene: Three.Scene, startingPosition? : Three.Vector3){

        this.material = material;
        let geometry = new Three.TetrahedronGeometry(radius,2);

        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.scale.x = Cloud.baseScale.x;
        this.mesh.scale.y = Cloud.baseScale.y;
        this.mesh.scale.z = Cloud.baseScale.z;

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

        let scaleOffset = Math.sin(totalElapsedTime * 0.001) * 0.1;
        this.mesh.scale.x = Cloud.baseScale.x + scaleOffset;
        this.mesh.scale.y = Cloud.baseScale.y + scaleOffset;
        this.mesh.scale.z = Cloud.baseScale.z + scaleOffset;

        if((totalElapsedTime / 25) % 2 <= 0.02){
            this.SpawnRaindrop();
        }

        this.raindrops.forEach((raindrop)=>{
            raindrop.Animate();
        });

    }

    SpawnRaindrop(){

        let raindrop = new Rain(this.material, this.rainDirection, 1);
        
        let x = ((Math.random() * 2) - 1) * 10;
        let z = ((Math.random() * 2) - 1) * 30;

        raindrop.mesh.position.x = x;
        raindrop.mesh.position.z = z;
        this.mesh.add(raindrop.mesh);

        this.raindrops.push(raindrop);

    }

}

export default Cloud;