import * as Three from "three";

import Sun from "./Sun";

class SunRay {

    sun: Sun;

    mesh: Three.Mesh;
    radius: number = 0;
    height: number = 0;
    angle: number = 0;

    radiusOffset: number = 30;

    constructor(radius: number, height: number, material: Three.MeshBasicMaterial, angle: number, sun: Sun){

        this.sun = sun;

        let geometry = new Three.ConeGeometry(radius, height, 4);
        this.mesh = new Three.Mesh(geometry, material);

        this.radius = radius;
        this.height = height;

        this.SetAngle(angle);

    }

    SetAngle(value: number){

        this.angle = value;
        
        let z = Math.cos(value) * (this.sun.radius + this.radiusOffset);
        let y = Math.sin(value) * (this.sun.radius + this.radiusOffset);

        this.mesh.position.x = this.sun.mesh.position.x;
        this.mesh.position.z = z;
        this.mesh.position.y = y;

        this.mesh.rotation.x = -value + 1.57;

    }

}

export default SunRay