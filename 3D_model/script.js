import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader"
import { OrbitControls } from "OrbitControls"

// Canvas取得
const canvas = document.querySelector("canvas.cylinder-canvas");
// Scene作成
const scene = new THREE.Scene();
// 3Dモデル取得
const loader = new GLTFLoader();
const url = "model.gltf";
let model = null;

var mixer2 = null;

// 3Dモデル配置、アニメーション描画開始
loader.load(
  url,
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
    // アニメーション
    mixer2 = new THREE.AnimationMixer(model);
    gltf.animations.forEach((animation) => {
      actions.push(mixer2.clipAction(animation).play());
    });
    tick();
  },
  function (error) {console.log(error);}
);

/**
 * 光源
 */
// 平行光
const light = new THREE.DirectionalLight(0xFFFFFF);
light.intensity = 1;
light.position.set(3, 10, 1);
scene.add(light);
// 周辺光
const ambientLight = new THREE.AmbientLight(0XFFFFE0, 0.7);
scene.add(ambientLight);
/**
 * サイズ
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/**
 * カメラ
 */
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.5, 150);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);
// カメラ制御
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * レンダラー
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio));
/**
 * アニメーション
 */
const tick = () => {
  // 時間差
  mixer2.update(THREE.Clock.getDelta);
  // カメラ制御
  controls.update();
  // レンダリング
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
