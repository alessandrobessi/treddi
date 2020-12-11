import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let container, renderer, scene, camera;

let line;
const MAX_POINTS = 50000;
const LENGTH = 50;
let drawCount;
let r = 400;
let halfR = r / 2;

init();
animate();

function init() {

    container = document.getElementById('canvas');

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1000);

    // geometry
    var geometry = new THREE.BufferGeometry();

    // attributes
    var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

    // drawcalls
    drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange(0, drawCount);
    geometry.computeBoundingSphere();

    // material
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 1,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    // line
    line = new THREE.Line(geometry, material);
    scene.add(line);

    updatePositions();

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

// update positions
function updatePositions() {

    let positions = line.geometry.attributes.position.array;

    let x = 0;
    let y = 0;
    let z = 0;
    let index = 0;

    for (var i = 0, l = MAX_POINTS; i < l; i++) {

        positions[index++] = x;
        positions[index++] = y;
        positions[index++] = z;

        x += (Math.random() - 0.5) * LENGTH;
        y += (Math.random() - 0.5) * LENGTH;
        z += (Math.random() - 0.5) * LENGTH;

        if (x < -halfR) {
            x = -halfR;
        }

        if (x > halfR) {
            x = halfR;
        }

        if (y < -halfR) {
            y = -halfR;
        }

        if (y > halfR) {
            y = halfR;
        }

        if (z < -halfR) {
            z = -halfR;
        }

        if (z > halfR) {
            z = halfR;
        }
    }

}

// render
function render() {

    renderer.render(scene, camera);

}

// animate
function animate() {

    requestAnimationFrame(animate);

    drawCount = (drawCount + 1) % MAX_POINTS;

    line.geometry.setDrawRange(0, drawCount);

    updatePositions();
    line.material.color.setRGB(Math.random(), Math.random(), Math.random());
    line.material.color.needsUpdate = true;

    const time = Date.now() * 0.001;
    line.rotation.x = time * 0.1;
    line.rotation.y = time * 0.1;

    render();

}
