import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let url = 'positions.json';
let positions;
let time = 0;
let id;

fetch(url)
	.then(res => res.json())
	.then((out) => {
		positions = out;
		try {
			animate();
		} catch {
			cancelAnimationFrame(id);
		}
	})
	.catch(err => {
		throw err;
	});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ "antialias": true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(0.4, 32, 32);
var geometrySmall = new THREE.SphereGeometry(0.2, 32, 32);
var material = new THREE.MeshNormalMaterial();

var planet1 = new THREE.Mesh(geometry, material);
planet1.position.x -= 2;
scene.add(planet1);

var planet2 = new THREE.Mesh(geometry, material);
planet2.position.x += 2;
scene.add(planet2);

var planet3 = new THREE.Mesh(geometry, material);
planet3.position.y += Math.sqrt(3);
scene.add(planet3);

var planet4 = new THREE.Mesh(geometrySmall, material);
planet4.position.y += Math.sqrt(3) / 2;
scene.add(planet4);

camera.position.z = 20;
camera.position.y += 5;

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('resize', onWindowResize, false);


var animate = function () {
	id = requestAnimationFrame(animate);

	let i = parseInt(time);
	planet1.position.x = positions[i]["p1"].x
	planet1.position.y = positions[i]["p1"].y
	planet1.position.z = positions[i]["p1"].z

	planet2.position.x = positions[i]["p2"].x
	planet2.position.y = positions[i]["p2"].y
	planet2.position.z = positions[i]["p2"].z

	planet3.position.x = positions[i]["p3"].x
	planet3.position.y = positions[i]["p3"].y
	planet3.position.z = positions[i]["p3"].z

	planet4.position.x = positions[i]["p4"].x
	planet4.position.y = positions[i]["p4"].y
	planet4.position.z = positions[i]["p4"].z

	const t = Date.now() * 0.001;
	planet1.rotation.x = t * 0.1;
	planet1.rotation.y = t * 0.1;
	planet2.rotation.x = t * 0.1;
	planet2.rotation.y = t * 0.1;
	planet3.rotation.x = t * 0.1;
	planet3.rotation.y = t * 0.1;
	planet4.rotation.x = t * 0.1;
	planet4.rotation.y = t * 0.1;

	time++;

	renderer.render(scene, camera);
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
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
