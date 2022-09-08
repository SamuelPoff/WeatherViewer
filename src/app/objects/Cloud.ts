import * as Three from "three";

class Cloud{

    static baseScale: Three.Vector3 = new Three.Vector3(2,1,2);

    mesh: Three.Mesh;

    constructor(radius: number, material: Three.MeshBasicMaterial, scene: Three.Scene){

        let geometry = new Three.TetrahedronGeometry(radius,2);

        this.mesh = new Three.Mesh(geometry, material);
        this.mesh.scale.x = Cloud.baseScale.x;
        this.mesh.scale.y = Cloud.baseScale.y;
        this.mesh.scale.z = Cloud.baseScale.z;

        this.mesh.position.y = 25;

        scene.add(this.mesh);

    }

    Animate(){



    }

}

export default Cloud;