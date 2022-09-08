import * as Three from "three";

import SunRay from "./SunRay";

class Sun{

    mesh: Three.Mesh;

    radius: number = 0;
    sunRays: SunRay[] = [];

    private sunRotationSpeed = 0.005;
    private sunRayRotationSpeed = 0.001;

    constructor(radius: number, xOffset:number, numSunRays: number, mesh: Three.MeshBasicMaterial, scene: Three.Scene){

        let geometry = new Three.IcosahedronGeometry(radius, 2);
        this.mesh = new Three.Mesh(geometry, mesh);
        this.mesh.position.x = -xOffset;

        this.radius = radius;

        //Gonna keep all angles in RADIANS just so I dont forget to convert and then wonder why everything looks random and wrong
        let angleIncrement = (Math.PI*2) / numSunRays;
        for(let i = 0; i < numSunRays; i++){

            let angle = angleIncrement * i;
            let sunRay = new SunRay(1, 30, mesh, angle, this, scene);

            this.sunRays.push(sunRay);
        }

        //Construct wireframe
        let wireframeGeo = new Three.EdgesGeometry(this.mesh.geometry);
        let wireframeMat = new Three.LineBasicMaterial( {color: 0xffffff} );
        let wireframe = new Three.LineSegments(wireframeGeo, wireframeMat);
        this.mesh.add(wireframe);

        scene.add(this.mesh);

    }

    Animate(totalElapsedTime: number, deltaTime: number){

        this.mesh.rotation.y += this.sunRotationSpeed;

        for(let i = 0; i < this.sunRays.length; i++){

            let sunRay = this.sunRays[i];

            let scaleOffset = (Math.sin(totalElapsedTime * 0.001) * 0.25)
            if(i%2 == 0){
                scaleOffset *= -1;
            }
            sunRay.mesh.scale.y = 1 + scaleOffset;

            sunRay.SetAngle(sunRay.angle + this.sunRayRotationSpeed);

        }

    }
    

}

export default Sun;