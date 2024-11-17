import { type Color, type Mesh, ShaderMaterial, type Texture } from 'three';
import * as THREE from 'three';

//

export const colorToVec4 = (color: Color) =>
  new THREE.Vector4(color.r, color.g, color.b, 1.0);

//

export const createBinaryShadeMaterial = (low: Color, high: Color) =>
  new THREE.ShaderMaterial({
    uniforms: {
      low: { value: low },
      high: { value: high },
      lightDir: { value: new THREE.Vector3(1, 1, 1).normalize() },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
    
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * vec4(vPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 low;
      uniform vec3 high;
      uniform vec3 lightDir;
      varying vec3 vNormal;
   
      void main() {
        float intensity = max(dot(vNormal, lightDir), 0.0);
        vec3 color = intensity < 0.5 ? low : high;
        gl_FragColor = vec4(color, 1.0);
      }
      `,
  });

export const createOutlineMaterial = (outline: Color, thickness: number) =>
  new ShaderMaterial({
    uniforms: {
      outline: { value: colorToVec4(outline) },
    },
    vertexShader: `
      void main() {
        vec3 newPosition = position + normal * ${thickness};
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec4 outline;

      void main() {
        gl_FragColor = outline;
      }
    `,
    side: THREE.BackSide,
  });

//

export const toonifyMesh = ({
  mesh,
  thickness,
  colors,
}: {
  mesh: Mesh;
  thickness: number;
  colors: { low: Color; high: Color; outline: Color };
}) => {
  const outline = new THREE.Mesh(
    mesh.geometry,
    createOutlineMaterial(colors.outline, thickness),
  );
  outline.isToonified = true;

  mesh.add(outline);
  mesh.material = createBinaryShadeMaterial(colors.low, colors.high);
  mesh.isToonified = true;
};
