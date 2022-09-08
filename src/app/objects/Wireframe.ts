
import * as Three from "three";

/* Takes any mesh and will recreate its wireframe from the geometry and automatically add itself to the mesh to share its properties
   (Useful for making the geometry all look like wireframes while actually rendering it solid with a wireframe on top) 
*/
class Wireframe{

    lineSegments : Three.LineSegments;

    constructor(mesh: Three.Mesh){

        let wireframeGeometry = new Three.EdgesGeometry(mesh.geometry);
        let wireframeMaterial = new Three.LineBasicMaterial( {color: 0xffffff} );

        this.lineSegments = new Three.LineSegments(wireframeGeometry, wireframeMaterial);
        mesh.add(this.lineSegments);


    }

}

export default Wireframe;