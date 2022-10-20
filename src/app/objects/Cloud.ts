import * as Three from "three";
import { Vector3 } from "three";

import Rain from "./Rain";
import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";

class Cloud implements Animatable{

    enabled: boolean = true;
    baseScale: Three.Vector3 = new Three.Vector3(3,1,3);

    mesh: Three.Mesh;
    wireframe: Wireframe;
    material: Three.Material;

    animationOffset: number = 0;
    timer: number = 0;

    constructor(radius: number, scaleOffset: number, material: Three.Material, scene: Three.Scene, raining: boolean, startingPosition? : Three.Vector3, animationOffset?: number){

        this.material = material;
        let geometry = new Three.TetrahedronGeometry(radius,2);

        if(animationOffset){
            this.animationOffset = animationOffset;
        }

        this.timer = Math.random() * 990;

        this.baseScale.x += ((Math.random() * 3) - 1.5);
        this.baseScale.y += ((Math.random() * 2) - 1) * 0.25;
        this.baseScale.z += ((Math.random() * 3) - 1.5);

        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.scale.x = this.baseScale.x + scaleOffset;
        this.mesh.scale.y = this.baseScale.y + scaleOffset/3;
        this.mesh.scale.z = this.baseScale.z + scaleOffset;

        if(startingPosition){
            this.mesh.position.x = startingPosition.x;
            this.mesh.position.y = startingPosition.y;
            this.mesh.position.z = startingPosition.z;
        }

        this.wireframe = new Wireframe(this.mesh);
        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        let scaleOffset = (Math.sin(totalElapsedTime * (0.001) + this.animationOffset) * 0.1) * (deltaTime/20);
        this.mesh.scale.x = this.baseScale.x + scaleOffset;
        this.mesh.scale.y = this.baseScale.y + scaleOffset;
        this.mesh.scale.z = this.baseScale.z + scaleOffset;

    }

}

export default Cloud;