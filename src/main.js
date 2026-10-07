import './style.css';
import './story.js';
import * as THREE from 'three';
import { animate, createTimer, stagger, utils } from 'animejs';
import { getInstances } from 'animejs/adapters/three';

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calm) document.documentElement.classList.add('js');

/* ---- Hero scene: instanced cube lattice driven by the Anime.js Three.js adapter ---- */
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 17;
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const dirLight = new THREE.DirectionalLight(0xe9d8a6, 1.6);
dirLight.position.set(2, 3, 4);
scene.add(dirLight);

const N = 6, CELL = 0.9, SPREAD = ((N - 1) / 2) * CELL, EXPAND = 2.3;
const mesh = new THREE.InstancedMesh(
  new THREE.BoxGeometry(CELL * 0.86, CELL * 0.86, CELL * 0.86),
  new THREE.MeshLambertMaterial({ color: 0xffffff }),
  N ** 3
);
mesh.frustumCulled = false;
const a = new THREE.Color('#0a9396'), b = new THREE.Color('#94d2bd'), c = new THREE.Color();
for (let i = 0; i < N ** 3; i++) {
  c.copy(a).lerp(b, i / (N ** 3 - 1));
  if (i % 11 === 0) c.set('#ee9b00');
  mesh.setColorAt(i, c);
}
const pointLight = new THREE.PointLight(0x94d2bd, 8, 24, 0.4);
const group = new THREE.Group(); // pointer + scroll tilt lives here, spin lives on the mesh
group.add(mesh, pointLight);
scene.add(group);

const instances = getInstances(mesh);
utils.set(instances, {
  x: stagger([-SPREAD, SPREAD], { grid: [N, N, N], axis: 'x' }),
  y: stagger([-SPREAD, SPREAD], { grid: [N, N, N], axis: 'y' }),
  z: stagger([-SPREAD, SPREAD], { grid: [N, N, N], axis: 'z' }),
});

if (!calm) {
  animate(mesh, {
    rotateY: { to: 360, duration: 16000 },
    rotateX: { to: 360, duration: 22000 },
    loop: true, ease: 'inOutQuad',
  });
  animate(pointLight, {
    intensity: [30, 0], duration: 2500,
    loop: true, loopDelay: 500, alternate: true, ease: 'out(3)',
  });
  animate(instances, {
    x: (i) => i.x * EXPAND, y: (i) => i.y * EXPAND, z: (i) => i.z * EXPAND,
    duration: 2000,
    delay: stagger([0, 500], { grid: true, from: 'center', reversed: true, ease: 'in(3)' }),
    loop: true, loopDelay: 500, alternate: true, ease: 'inOutExpo',
  });
}

let px = 0, py = 0;
function render() {
  group.rotation.y = scrollY * 0.0009 + px * 0.5;
  group.rotation.x = 0.2 + py * 0.35;
  renderer.render(scene, camera);
}
function resize() {
  const w = innerWidth, h = innerHeight, wide = w > 900;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  group.position.x = wide ? 4.6 : 0; group.scale.setScalar(wide ? 1 : 0.75);
  render();
}
addEventListener('resize', resize);
addEventListener('pointermove', (e) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; });
resize();
if (!calm) createTimer({ onUpdate: render });

/* ---- UI motion ---- */
if (!calm) {
  animate('.hero [data-in]', {
    opacity: [0, 1], y: [28, 0], filter: ['blur(10px)', 'blur(0px)'],
    delay: stagger(110), duration: 1100, ease: 'outExpo',
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    animate(e.target, { opacity: [0, 1], y: [32, 0], duration: 900, ease: 'outExpo' });
  }), { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

document.querySelectorAll('[data-count]').forEach((el) => {
  const to = +el.dataset.count, s = el.dataset.suffix || '';
  if (calm) { el.textContent = to + s; return; }
  const n = { v: 0 };
  new IntersectionObserver(([e], ob) => {
    if (!e.isIntersecting) return;
    ob.disconnect();
    animate(n, { v: to, duration: 1800, ease: 'outExpo', onUpdate: () => (el.textContent = Math.round(n.v) + s) });
  }).observe(el);
});

document.querySelectorAll('.card').forEach((c) => c.addEventListener('pointermove', (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}));
