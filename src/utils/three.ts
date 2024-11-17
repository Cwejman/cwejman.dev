import { Color, type Mesh, ShaderMaterial, type Texture } from 'three';

import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

//

export const colorToVec4 = (color: Color) =>
  new THREE.Vector4(color.r, color.g, color.b, 1.0);

//

export const createBinaryShadeMaterial = (
  low: Color,
  high: Color,
  thresh = 0.5,
) =>
  new THREE.ShaderMaterial({
    uniforms: {
      thresh: { value: thresh },
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
      uniform float thresh;
      uniform vec3 low;
      uniform vec3 high;
      uniform vec3 lightDir;
      varying vec3 vNormal;
   
      void main() {
        float intensity = max(dot(vNormal, lightDir), 0.0);
        vec3 color = intensity < thresh ? low : high;
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
  thresh,
  colors,
}: {
  mesh: Mesh;
  thickness: number;
  thresh?: number;
  colors: { low: Color; high: Color; outline: Color };
}) => {
  const outline = new THREE.Mesh(
    mesh.geometry,
    createOutlineMaterial(colors.outline, thickness),
  );

  outline.isToonified = true;

  mesh.add(outline);
  mesh.material = createBinaryShadeMaterial(colors.low, colors.high, thresh);
  mesh.isToonified = true;
};

//

type HSL = [h: number, s: number, l: number];
type RGB = [r: number, g: number, b: number];

const parseHsl = (hsl: string): HSL => {
  const match = hsl.match(/hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)/);

  if (!match) {
    throw new Error('Invalid HSL string format');
  }

  const [_, h, s, l] = match; // Extract values

  return [Number.parseFloat(h), Number.parseFloat(s), Number.parseFloat(l)];
};

const hslToRgbFloats = ([h, s, l]: HSL): RGB => {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);

  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [f(0), f(8), f(4)];
};

export const createColorFromHslString = (hsl: string) =>
  new Color(...hslToRgbFloats(parseHsl(hsl)));
