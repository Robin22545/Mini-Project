function degrees_to_radians(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}



// /***************socket.io********************/
let roll;
let pitch;
let yaw;

// let data;
let dataArray;


const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("message", (event) => {
  event.preventDefault(); // Prevent the default behavior
  dataArray = event.data.split(',');
  roll = degrees_to_radians(parseFloat(dataArray[0]));
  pitch = degrees_to_radians(parseFloat(dataArray[1]));
  yaw = degrees_to_radians(parseFloat(dataArray[2]));
  console.log("Imu data",roll,pitch,yaw)

});

// /***************socket.io********************/

import * as THREE from 'three';
var scene3d = document.getElementById("scene3d");
var w = scene3d.offsetWidth;
var h = scene3d.offsetHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h, false);
scene3d.appendChild(renderer.domElement);
var euler = new THREE.Euler(pitch, yaw, roll, "XYZ");
var meshA = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1), // length, breadth, height
	new THREE.MeshNormalMaterial());

// cloning this mesh
var box1 = meshA.clone();
box1.rotation.copy(euler);
box1.position.set(0, 0, 0);
scene.add(box1);

// axes helper 

const axesHelper = new THREE.AxesHelper( 10 );
// camera.lookAt(axesHelper.position);

scene.add( axesHelper );
axesHelper.setColors(0x0000ff,0xff0000,0x013220 );// x,y,z 

function animate() {
	requestAnimationFrame(animate);

	euler = new THREE.Euler(pitch, yaw, roll);
	// euler = new THREE.Euler(roll,pitch,yaw);
	box1.rotation.copy(euler);
	renderer.render(scene, camera);

}

function toggleFullScreen() {
	if (!document.fullscreenElement) {
	  scene3d.requestFullscreen().catch((err) => {
		console.error(`Error attempting to enable full-screen mode: ${err.message}`);
	  });
	} else {
	  document.exitFullscreen();
	}
  }
  
  // Handle double-tap event
  let lastTapTime = 0;
  
  scene3d.addEventListener('click', (event) => {
	const currentTime = new Date().getTime();
	const timeSinceLastTap = currentTime - lastTapTime;
  
	if (timeSinceLastTap < 300) {
	  toggleFullScreen();
	}
  
	lastTapTime = currentTime;
  });
animate();

//Reference 
//https://dustinpfister.github.io/2021/04/28/threejs-euler/