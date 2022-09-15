import * as Three from "three";

import Cloud from "./Cloud";
import Wireframe from "./Wireframe";

class Rain{

    static baseHeight: number = 5;
    static baseRadius: number = 0.25;
    static radialSegments: number = 5;
    static baseScale: number = 1;

    mesh: Three.Mesh;
    wireframe: Wireframe;

    cloud: Cloud;

    direction: Three.Vector3;
    speed: number;

    lifetime: number = 0;

    constructor(material: Three.Material, direction: Three.Vector3, speed: number, cloud: Cloud){

        let geometry = new Three.ConeGeometry(Rain.baseRadius, Rain.baseHeight, Rain.radialSegments, 1);
        this.mesh = new Three.Mesh(geometry, material);

        this.wireframe = new Wireframe(this.mesh);

        let lookAt = new Three.Vector3(direction.x, -1 * direction.z, direction.y)
        this.mesh.lookAt(lookAt);

        this.direction = direction;
        this.speed = speed;

        //Randomize scaleprivate
        let randomScale = Rain.baseScale + (((Math.random() * 2) - 1) * 0.5);
        this.mesh.scale.multiplyScalar(randomScale);

        this.cloud = cloud;

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        //Just fly toward direction for now. The cloud that spawns this will take care of culling.
        //Later maybe add more effects or have it do something when it hits the "ground"

        this.mesh.position.add( this.direction.multiplyScalar(this.speed) );

        this.lifetime += deltaTime;
        if(this.lifetime >= 2000) {
            this.cloud.RemoveRaindrop(this);
        }

    }

}

export default Rain;