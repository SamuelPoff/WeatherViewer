import * as Three from "three";

import Wireframe from "./Wireframe";

class Rain{

    static baseHeight: number = 5;
    static baseRadius: number = 0.25;
    static radialSegments: number = 5;

    mesh: Three.Mesh;
    wireframe: Wireframe;

    direction: Three.Vector3;
    speed: number;

    constructor(material: Three.Material, direction: Three.Vector3, speed: number){

        let geometry = new Three.ConeGeometry(Rain.baseRadius, Rain.baseHeight, Rain.radialSegments, 1);
        this.mesh = new Three.Mesh(geometry, material);

        this.wireframe = new Wireframe(this.mesh);

        let lookAt = new Three.Vector3(direction.x, -1 * direction.z, direction.y)
        this.mesh.lookAt(lookAt);

        this.direction = direction;
        this.speed = speed;

    }

    Animate(){

        //Just fly toward direction for now. The cloud that spawns this will take care of culling.
        //Later maybe add more effects or have it do something when it hits the "ground"

        this.mesh.position.add( this.direction.multiplyScalar(this.speed) );

    }

}

export default Rain;