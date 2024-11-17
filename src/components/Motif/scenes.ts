import type { LoadModelFn } from '@components/Motif/createCanvas.ts';
import * as C from '@utils/common.ts';
import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export const robot: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/robot2.glb');

  model.scene.position.set(0, 0, 0);
  model.scene.scale.set(50, 50, 50);
  model.scene.rotation.x = -Math.PI / 2;
  model.scene.translateZ(-28);

  toonify(model, 0.005);
  scene.add(model.scene);

  const mixer = new THREE.AnimationMixer(model.scene);
  model.animations.forEach((clip) => mixer.clipAction(clip).play());

  return ({ scroll }) => {
    const main = C.interpolate(scroll, 0, 0.6);
    const last = C.interpolate(scroll, 0.6, 1) * 0.15;

    mixer.setTime(main * model.animations[0].duration - 0.01);
    model.scene.rotation.z = Math.PI * 1.3 - (main + last) * Math.PI;
  };
};

export const bearing: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/bearing.glb');

  model.scene.position.set(0, 0, 0);
  model.scene.scale.set(10, 10, 10);

  toonify(model, 0.02);
  scene.add(model.scene);

  return ({ scroll }) => {
    model.scene.rotation.set(0, 0, scroll * 3); // Isolate the spin
    model.scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 1 - scroll);
  };
};

export const containers: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/containers.glb');

  model.scene.position.set(-15, -15, 0);
  model.scene.scale.set(6, 6, 6);

  toonify(model, 0.1);
  scene.add(model.scene);

  return ({ scroll }) => {
    model.scene.rotation.set(0, Math.PI / 2 + scroll, 0);
  };
};

export const crates: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/crates.glb');

  model.scene.position.set(5, -20, 0);
  model.scene.scale.set(1, 1, 1);

  toonify(model, 0.2);
  scene.add(model.scene);

  return ({ scroll }) => {
    const factor = C.interpolate(1 - scroll, 0.5, 1);
    model.scene.children[0].position.y = factor * 1 * 20;
    model.scene.children[1].position.y = factor * 4 * 20;
    model.scene.children[2].position.y = factor * 2 * 20;

    model.scene.rotation.set(0.2, 2 - scroll * 2, 0);
  };
};

export const wheel: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/wheel.glb');

  model.scene.position.set(0, 0, 0);
  model.scene.scale.set(13, 13, 13);

  toonify(model, 0.01);
  scene.add(model.scene);

  return ({ scroll }) => {
    model.scene.position.x = (0.5 - scroll) * 200;
    model.scene.rotation.set(Math.PI / 2, scroll * 6, 0);
  };
};

export const plant: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/plant.glb');

  model.scene.position.set(0, -9, 0);
  model.scene.scale.set(80, 80, 80);

  toonify(model, 0.003);
  scene.add(model.scene);

  let rot = 0;
  return ({ scroll, dt }) => {
    rot = (rot + dt) % (Math.PI * 2);
    model.scene.rotation.y = rot + scroll * 10;
  };
};

export const computer: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/computer.glb');

  model.scene.position.set(0, -20, 0);
  model.scene.scale.set(20, 20, 20);

  toonify(model, 0.008);
  scene.add(model.scene);

  return ({ scroll }) => {
    const factor = C.clamp(0, 0.7, scroll);

    model.scene.position.z = -150 + factor * 200;
    model.scene.position.x = 4 - scroll * 20;
    model.scene.rotation.y = -1 + scroll * 1.5;
  };
};

export const module: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/module.glb');

  model.scene.scale.set(5, 5, 5);
  model.scene.rotation.set(0, 0, 0);
  model.scene.position.set(0, 0, 0);

  toonify(model, 0.05);
  scene.add(model.scene);

  return ({ scroll }) => {
    const factor = C.interpolate(scroll, 0, 0.6);
    model.scene.rotation.z = -factor / 2;
    model.scene.rotation.x = -Math.PI / 2 + factor * Math.PI;
  };
};

export const bobby: LoadModelFn = async (scene, toonify) => {
  const model = await loader.loadAsync('/models/bobby.glb');

  model.scene.scale.set(15, 15, 15);
  model.scene.position.set(0, 0, 0);
  model.scene.rotation.set(Math.PI / 2, 0, 0);

  toonify(model, 0.01, 0.6);
  scene.add(model.scene);

  const initScene = model.scene.clone();

  return ({ scroll }) => {
    const factor = 1 - C.clamp(0, 0.6, scroll) / 0.6;

    model.scene.children.forEach((child, i) => {
      const { rotation, position } = initScene.children[i];

      child.position.copy(position.clone().multiplyScalar(1 + factor * 4));

      child.rotation.set(
        rotation.x + factor * 3,
        rotation.y + factor * 3,
        rotation.z + factor * 3,
      );
    });

    model.scene.rotation.y = scroll * 3;
  };
};
