import * as Three from "three";

import Sun from "./Sun";
import Wireframe from "./Wireframe";

class SunRay {

    sun: Sun;

    mesh: Three.Mesh;
    radius: number = 0;
    height: number = 0;
    angle: number = 0;

    radiusOffset: number = 50;

    //wireframe: Wireframe;

    constructor(radius: number, height: number, material: Three.ShaderMaterial, angle: number, sun: Sun, scene: Three.Scene){

        this.sun = sun;

        let geometry = new Three.ConeGeometry(radius, height, 4);
        this.mesh = new Three.Mesh(geometry, material);

        this.radius = radius;
        this.height = height;

        this.SetAngle(angle);

        //this.wireframe = new Wireframe(this.mesh);
        scene.add(this.mesh);

    }

    SetAngle(value: number){

        this.angle = value;
        
        let z = Math.cos(value) * (this.sun.radius + this.radiusOffset);
        let y = Math.sin(value) * (this.sun.radius + this.radiusOffset) + this.sun.mesh.position.y;

        this.mesh.position.x = this.sun.mesh.position.x;
        this.mesh.position.z = z;
        this.mesh.position.y = y;

        this.mesh.rotation.x = -value + 1.57;

    }

}

export default SunRay