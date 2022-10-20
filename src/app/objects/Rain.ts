import * as Three from "three";

import Cloud from "./Cloud";
import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";
import { Vector3 } from "three";

class Rain implements Animatable{

    enabled: boolean = true;
    
    static baseHeight: number = 10;
    static baseRadius: number = 0.1;
    static radialSegments: number = 5;
    static baseScale: number = 1;

    mesh: Three.Mesh;
    wireframe: Wireframe;

    direction: Three.Vector3;
    speed: number;

    lifetime: number = 0;

    public onDestroy?: (rain: Rain)=>void
    public onDestroyContext?: any;

    constructor(material: Three.Material, direction: Three.Vector3, speed: number){

        let geometry = new Three.ConeGeometry(Rain.baseRadius, Rain.baseHeight, Rain.radialSegments, 1);
        this.mesh = new Three.Mesh(geometry, material);

        this.wireframe = new Wireframe(this.mesh);

        let lookAt = new Three.Vector3(direction.x, -1 * direction.z, direction.y)
        this.mesh.lookAt(lookAt);

        this.direction = direction.normalize();
        this.speed = speed;

        //Randomize scale
        let randomScale = Rain.baseScale + (((Math.random() * 2) - 1) * 0.5);
        this.mesh.scale.multiplyScalar(randomScale);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        //Just fly toward direction for now. The cloud that spawns this will take care of culling.
        //Later maybe add more effects or have it do something when it hits the "ground"

        let offset = new Vector3(this.direction.x * this.speed * deltaTime, this.direction.y * this.speed * deltaTime, this.direction.z * this.speed * deltaTime);
        this.mesh.position.add( offset );

        this.lifetime += deltaTime;
        if(this.lifetime >= 2000) {
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

        //Set position to (0,0,0) so that lookat "looks at" the correct direction (since the direction is based on an origin of 0,0,0)
        this.mesh.position.set(0,0,0);
        let lookAt: Vector3 = new Vector3(direction.x, -1* direction.z, this.direction.y);
        this.mesh.lookAt(lookAt);

        this.direction = direction.normalize();
        this.speed = speed;

        //Randomize scale
        let randomScale = Rain.baseScale + (((Math.random() * 2) - 1) * 0.5);
        this.mesh.scale.set(randomScale, randomScale, randomScale);

        this.lifetime = 0;

    }

}

export default Rain;