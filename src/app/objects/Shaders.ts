import * as Three from "three";

export function CreateGradientShader(colorA: Three.Color, colorB: Three.Color): any{

    const GradientShader = {uniforms: {
        color1: {
          value: colorA
        },
        color2: {
          value: colorB
          
        }
      },
      vertexShader: `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
      
        varying vec2 vUv;
        
        void main() {
          
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `
    }

}
