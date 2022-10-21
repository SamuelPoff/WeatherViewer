import * as Three from 'three';
import { Vector3 } from 'three';
import { randInt } from 'three/src/math/MathUtils';

import Animatable from '../interfaces/Animatable';

class Snow implements Animatable{

    enabled: boolean = true;

    mesh: Three.Mesh;

    direction: Vector3;
    speed: number;

    animationOffset: number;
    animationDirection: number; //-1 or 1

    public onDestroy? : (snow: Snow)=>void;
    public onDestroyContext?: any

    constructor(material: Three.Material, direction: Vector3, speed: number){

        this.direction = direction.normalize();
        this.speed = speed;

        this.animationOffset = Math.random();
        this.animationDirection = Math.random() >= 0.5 ? 1 : -1;

        let geometry = new Three.IcosahedronGeometry(0.5, 1);
        this.mesh = new Three.Mesh(geometry, material);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        let frequency = 0.0008;
        let amplitude = 0.5;
        let xOffset = Math.sin(totalElapsedTime * frequency + this.animationOffset) * amplitude * this.animationDirection;
        
        frequency = 0.0006;
        amplitude = 0.5;
        let zOffset = Math.sin(totalElapsedTime * frequency + this.animationOffset) * amplitude * this.animationDirection;

        this.mesh.position.x += (this.direction.x * this.speed * deltaTime) + xOffset;
        this.mesh.position.y += this.direction.y * this.speed * deltaTime;
        this.mesh.position.z += (this.direction.z * this.speed * deltaTime) + zOffset;

        if(this.mesh.position.y <= -5){

            if(this.onDestroy){
                if(this.onDestroyContext){
                    this.onDestroy.apply(this.onDestroyContext, [this]);
                }
                else{
                    this.onDestroy(this);
                }
            }

        }

    }

    Setup(direction: Vector3, speed: number){

        this.direction = direction;
        this.speed = speed;

    }

}

export default Snow;