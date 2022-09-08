import * as Three from "three";

import Wireframe from "./Wireframe";

class Cloud{

    static baseScale: Three.Vector3 = new Three.Vector3(2,1,2);

    mesh: Three.Mesh;
    wireframe: Wireframe;

    constructor(radius: number, material: Three.MeshBasicMaterial, scene: Three.Scene){

        let geometry = new Three.TetrahedronGeometry(radius,2);

        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.scale.x = Cloud.baseScale.x;
        this.mesh.scale.y = Cloud.baseScale.y;
        this.mesh.scale.z = Cloud.baseScale.z;

        this.mesh.position.y = 25;

        this.wireframe = new Wireframe(this.mesh);
        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        let scaleOffset = Math.sin(totalElapsedTime * 0.001) * 0.1;
        this.mesh.scale.x = Cloud.baseScale.x + scaleOffset;
        this.mesh.scale.y = Cloud.baseScale.y + scaleOffset;
        this.mesh.scale.z = Cloud.baseScale.z + scaleOffset

    }

}

export default Cloud;