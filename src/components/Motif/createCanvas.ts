import * as THREE from 'three';
import { Mesh, type Scene } from 'three';

import { getScrollProgress } from '@utils/dom.ts';
import { createColorFromHslString, toonifyMesh } from '@utils/three.ts';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

//

export type UpdateModelFn = (props: { scroll: number; dt: number }) => void;

export type LoadModelFn = (
  scene: Scene,
  toonify: (model: GLTF, thickness: number, thresh?: number) => void,
) => Promise<UpdateModelFn>;

export interface CreateCanvasProps {
  container: HTMLElement;
  loadModel: LoadModelFn;
}

export const createCanvas = async ({
  container,
  loadModel,
}: CreateCanvasProps) => {
  const { clientWidth: width, clientHeight: height } = container;

  const style = getComputedStyle(container);
  const colors = {
    high: createColorFromHslString(style.getPropertyValue('--high')),
    low: createColorFromHslString(style.getPropertyValue('--low')),
    strong: createColorFromHslString(style.getPropertyValue('--strong')),
  };

  const scene = new THREE.Scene();

  //

  const updateModel = await loadModel(scene, (model, thickness, thresh) => {
    model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && !node.isToonified) {
        toonifyMesh({
          mesh: node,
          thickness,
          thresh,
          colors: {
            low: colors.low,
            high: colors.high,
            outline: colors.strong,
          },
        });
      }
    });
  });

  //

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 50000);
  light.position.set(-100, 0, 100);
  scene.add(light);

  //

  const camera = new THREE.PerspectiveCamera(35, width / height);
  camera.position.z = 150;

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    updateModel({
      scroll: getScrollProgress(container),
      dt: clock.getDelta(),
    });

    renderer.render(scene, camera);
  });

  //

  container.appendChild(renderer.domElement);
  container.addEventListener('resize', () =>
    renderer.setSize(container.clientWidth, container.clientHeight),
  );

  console.log(`init complete (el: ${container})`);
};
