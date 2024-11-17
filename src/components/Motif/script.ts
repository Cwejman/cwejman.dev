import * as THREE from 'three';
import { Color, Mesh, TextureLoader } from 'three';
import { type GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as C from '@utils/common.ts';
import { getScrollProgress } from '@utils/dom.ts';
import { toonifyMesh } from '@utils/three.ts';

const loader = new GLTFLoader();

//

interface CreateCanvasProps {
  container: HTMLElement;
  loadModel: (loader: GLTFLoader) => Promise<GLTF>;
}

/*
declare global {
  interface Window {
    createCanvas: (props: CreateCanvasProps) => Promise<void>;
  }
}*/

export const createCanvas = async ({
  container,
  loadModel,
}: CreateCanvasProps) => {
  const { clientWidth: width, clientHeight: height } = container;

  const style = getComputedStyle(container);
  const colors = {
    background: new Color(style.getPropertyValue('--background')),
    strong: new Color(style.getPropertyValue('--strong')),
    light: new Color(style.getPropertyValue('--light')),
  };

  console.log(colors);

  const scene = new THREE.Scene();

  //

  const model = await loadModel(loader);

  model.scene.traverse((node) => {
    if (node instanceof Mesh && !node.isToonified)
      toonifyMesh({
        mesh: node,
        thickness: 0.004,
        colors: {
          outline: colors.strong,
          low: colors.light,
          high: colors.background,
        },
      });
  });

  scene.add(model.scene);

  const mixer = new THREE.AnimationMixer(model.scene);
  model.animations.forEach((clip) => mixer.clipAction(clip).play());

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

  //const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    //const dt = clock.getDelta();

    const scroll = getScrollProgress(container);
    const main = C.interpolate(scroll, 0, 0.6);
    const last = C.interpolate(scroll, 0.6, 1) * 0.15;

    mixer.setTime(main * model.animations[0].duration - 0.01);
    model.scene.rotation.z = Math.PI * 1.3 - (main + last) * Math.PI;

    renderer.render(scene, camera);
  });

  //

  container.appendChild(renderer.domElement);
  container.addEventListener('resize', () =>
    renderer.setSize(container.clientWidth, container.clientHeight),
  );

  console.log(`init complete (el: ${container})`);
};
