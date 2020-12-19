import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let group;
let container;
let camera, scene, renderer;
let positions;
let points;
let pointCloud;
let pointPositions;

const r = 400;
const pointCount = 500;

init();
animate();

function init() {

    container = document.getElementById('canvas');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.z = 0;

    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add(group);

    positions = new Float32Array(pointCloud * 3);

    const pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    });

    points = new THREE.BufferGeometry();
    pointPositions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {

        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;

        pointPositions[i * 3] = x;
        pointPositions[i * 3 + 1] = y;
        pointPositions[i * 3 + 2] = z;

    }

    points.setDrawRange(0, pointCount);
    points.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3).setUsage(THREE.DynamicDrawUsage));

    pointCloud = new THREE.Points(points, pMaterial);
    group.add(pointCloud);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.computeBoundingSphere();
    geometry.setDrawRange(0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyDown, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    group.rotation.y = time * 0.01;
    group.rotation.x = time * 0.01;

    renderer.render(scene, camera);

}

function onKeyDown(e) {
    switch (e["key"]) {
        case "ArrowUp":
            camera.position.y += 0.1;
            break;
        case "ArrowDown":
            camera.position.y -= 0.1;
            break;
        case "ArrowRight":
            camera.position.x += 0.1;
            break;
        case "ArrowLeft":
            camera.position.x -= 0.1;
            break;
        case "a":
            camera.position.z += 0.5;
            break;
        case "z":
            camera.position.z -= 0.5;
            break;
    }
}