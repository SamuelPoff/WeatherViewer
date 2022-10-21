import * as Three from "three";

import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";
import { Vector3 } from "three";

class Hail implements Animatable{

    enabled: boolean = true;

    mesh: Three.Mesh;
    wireframe: Wireframe;

    direction: Three.Vector3;
    speed: number;

    lifetime: number = 0;

    public onDestroy?: (hail: Hail)=>void
    public onDestroyContext?: any;

    constructor(material: Three.Material, direction: Three.Vector3, speed: number){

        let geometry = new Three.OctahedronGeometry(1, 1);
        this.mesh = new Three.Mesh(geometry, material);

        this.wireframe = new Wireframe(this.mesh);

        this.direction = direction.normalize();
        this.speed = speed;

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        //Just fly toward direction for now. The cloud that spawns this will take care of culling.
        //Later maybe add more effects or have it do something when it hits the "ground"

        this.mesh.position.x += this.direction.x * this.speed * deltaTime;
        this.mesh.position.y += this.direction.y * this.speed * deltaTime;
        this.mesh.position.z += this.direction.z * this.speed * deltaTime;

        this.mesh.rotateX(0.25);
        this.mesh.rotateY(0.25);
        this.mesh.rotateZ(0.1);

        if(this.mesh.position.y < -3) {
            if(this.onDestroy){
                if(this.onDestroyContext){
                    this.onDestroy.apply(this.onDestroyContext, [this]);
                }else{
                    this.onDestroy(this);
                }
            }
        }

    }

    Setup(direction: Vector3, speed: number){

        this.direction = direction.normalize();
        this.speed = speed;

        //Randomize scale
        let randomScale = Math.random() + 1
        this.mesh.scale.set(randomScale, randomScale, randomScale);

        this.lifetime = 0;

    }

}

export default Hail;