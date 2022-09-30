import * as Three from "three";

import SunRay from "./SunRay";
import Wireframe from "./Wireframe";

import Animatable from "../interfaces/Animatable";

class Sun implements Animatable{

    mesh: Three.Mesh;
    //wireframe: Wireframe;

    radius: number = 0;
    sunRays: SunRay[] = [];

    private sunRotationSpeed = 0.005;
    private sunRayRotationSpeed = 0.001;

    private strength = 1;

    constructor(radius: number, xOffset:number, numSunRays: number, strength: number, material: Three.Material, scene: Three.Scene){

        let geometry = new Three.IcosahedronGeometry(radius, 2);
          
        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.position.y = 100;
        this.mesh.position.x = -xOffset;

        this.radius = radius;
        this.strength = strength;

        //Gonna keep all angles in RADIANS just so I dont forget to convert and then wonder why everything looks random and wrong
        let angleIncrement = (Math.PI*2) / numSunRays;

        let sunRayBaseRadius = 4;
        let sunRayBaseHeight = 50;
        for(let i = 0; i < numSunRays; i++){

            let angle = angleIncrement * i;
            let sunRay = new SunRay(sunRayBaseRadius * strength, sunRayBaseHeight * strength, material, angle, this, scene);

            this.sunRays.push(sunRay);
        }

        //this.wireframe = new Wireframe(this.mesh);

        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        this.mesh.rotation.y += this.sunRotationSpeed;
        let frequency = 0.003;
        let amplitude = 0.3;

        for(let i = 0; i < this.sunRays.length; i++){

            let sunRay = this.sunRays[i];

            let scaleOffset = (Math.sin(totalElapsedTime * frequency) * amplitude)
            if(i%2 == 0){
                scaleOffset *= -1;
            }
            sunRay.mesh.scale.y = 1 + scaleOffset;

            sunRay.SetAngle(sunRay.angle + this.sunRayRotationSpeed);

        }

    }
    

}

export default Sun;