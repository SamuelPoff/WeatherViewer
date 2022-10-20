import * as Three from "three";

import SunRay from "./SunRay";
import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";

import ObjectPool from "./ObjectPool";

class Sun implements Animatable{

    enabled: boolean = true;
    mesh: Three.Mesh;
    //wireframe: Wireframe;

    radius: number = 0;
    sunRays: SunRay[] = [];

    static RotationSpeed = 0.0005;
    static SunRayRotationSpeed = 0.0001;
    private scene;

    private material : Three.Material;

    strength = 1;

    private sunRayPool = new ObjectPool<SunRay>(24, 
        ()=>{
            return new SunRay(4, 50, this.material, 0, this, this.scene);
        });

    constructor(radius: number, xOffset:number, numSunRays: number, strength: number, material: Three.Material, scene: Three.Scene){

        this.material = material;

        let geometry = new Three.IcosahedronGeometry(radius, 2);
        this.scene = scene;
          
        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.position.y = 100;
        this.mesh.position.x = -xOffset;

        this.radius = radius;
        this.strength = strength;

        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        this.mesh.rotation.y += Sun.RotationSpeed * deltaTime;
        let frequency = 0.003;
        let amplitude = 0.2;

        for(let i = 0; i < this.sunRays.length; i++){

            let sunRay = this.sunRays[i];

            let scaleOffset = (Math.sin(totalElapsedTime * frequency) * amplitude)
            if(i%2 == 0){
                scaleOffset *= -1;
            }
            sunRay.mesh.scale.y = 1 + scaleOffset;

            sunRay.SetAngle(sunRay.angle + Sun.SunRayRotationSpeed * deltaTime);

        }

    }

    SetupSunrays(num: number){

        let angleIncrement = (Math.PI*2) / num;

        let sunRayBaseRadius = 4;
        let sunRayBaseHeight = 50;
        for(let i = 0; i < num; i++){

            let angle = angleIncrement * i;
            
            let sunRay = this.sunRayPool.Get( (instance: SunRay) => {
                instance.SetAngle(angle);
                instance.mesh.visible = true;
            } );

            if(sunRay)
                this.sunRays.push(sunRay);

        }

    }

    ReturnSunRays(){

        let sunRayInstances = this.sunRayPool.GetInstancePool();

        for(let i = 0; i < sunRayInstances.length; ++i){
            this.sunRayPool.Return(i);
        }

        this.sunRays = new Array<SunRay>();
    }
    

}

export default Sun;