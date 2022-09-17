import * as Three from "three";

import Wireframe from "./Wireframe";

class Terrain{

    mesh: Three.Mesh;
    wireframe: Wireframe;

    constructor(material: Three.Material, heightmap: Array<number>){

        let geometry = new Three.PlaneGeometry(500, 800, 64, 64);
        geometry.rotateX(-1.57);

        //Copy geometry data into verticies to alter using heightmap
        const verticies: Float32Array = Float32Array.from(geometry.attributes['position'].array);
        for(let i = 0, j = 0; i < heightmap.length; i++, j += 3){
            verticies[j+1] = heightmap[i];
        }

        //Re-set geometry data from verticies;
        geometry.setAttribute('position', new Three.BufferAttribute(verticies, 3));

        this.mesh = new Three.Mesh(geometry, material);

        this.wireframe = new Wireframe(this.mesh);

    }

}

export default Terrain;