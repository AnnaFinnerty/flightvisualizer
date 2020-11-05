let lacur = 0;
let locur = -45;
let lamin = -90;
let lamax = 90;
let lomin = -180;
let lomax = -100;
let rotationx = 0;
let rotationy = 0;
let rotationz = 0;
let g_scale = 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const globe_geometry = new THREE.SphereGeometry();
var globe_texture = new THREE.TextureLoader().load('./globenight.jpeg');
// globe_texture.center.x = 0.5;
// globe_texture.center.y = 0;
// globe_texture.rotation = 1
const globe_material = new THREE.MeshBasicMaterial({map : globe_texture, opacity: 0.1});
const globe = new THREE.Mesh( globe_geometry, globe_material );
globe.scale.set(g_scale,g_scale,g_scale);
// globe.rotation.set(lacur,locur,0);
scene.add( globe );

const plane_geometry = new THREE.SphereGeometry(0.4,100,100);
const plane_material = new THREE.MeshBasicMaterial( { color: 'green' } );

camera.position.z = 5;

const spin = () => {
    console.log('spinning')
    rotationy -= .1
    globe.rotation.set(rotationx,rotationy,rotationz)
}

document.addEventListener('mousedown',(e)=>{
    e.target.style.cursor = "grab"
    spin()
})

document.addEventListener('mouseup',(e)=>{
    console.log('ungrab')
    e.target.style.cursor = "pointer"
})

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

const requestFlights = async(url = '', data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', 
      mode: 'cors', 
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json()
  }

const load = () => {
    const url = 'https://opensky-network.org/api/states/all'
    requestFlights(url)
    .then(data => {
      clearFlights();
      document.querySelector('#num_inflight').textContent = "Planes in flight: " + data.states.length
      for(let i in data.states){
          buildPlane(data.states[i])
      }
    
    });
    //update()
}

const update = () => {
    //const url = 'https://opensky-network.org/api/states/all?lamin=-90&lomin=0&lamax=90&lomax=180';
    const url = 'https://opensky-network.org/api/states/all?lamin='+lamin+'&lomin='+lomin+'&lamax='+lamax+'&lomax='+lomax;
    //const url = 'https://opensky-network.org/api/states/all'
    requestFlights(url)
    .then(data => {
      clearFlights();
    //   buildPlane(data.states[0])
    //  console.log(data.states[0])
      //console.log(data); // JSON data parsed by `data.json()` call
      document.querySelector('#num_inflight').textContent = "Planes in flight: " + data.states.length
      for(let i in data.states){
          buildPlane(data.states[i])
      }
    
    });
}

const start = () => {
    animate();
    load();
    setInterval(()=>{
        console.log('clearing flights')
        update();
    },5000)
}
start()

const buildPlane = (plane) => {
    const p = new THREE.Mesh( plane_geometry, plane_material );
    p.scale.set(.03,.03,.03)
    const pos = llaToECEF(plane[5],plane[6],plane[7],1)
    p.position.x = pos.x
    p.position.y = pos.y
    p.position.z = pos.z
    globe.add( p );
 }

 const llaToECEF = (lon,lat, alt, radius) => {
     //flattenting
     const f = 0;
     //lambda
     const l = Math.atan((1 - f)**2 * Math.tan(lat))
     const x = radius * Math.cos(l) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon)
     const y = radius * Math.cos(l) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon)
     const z = radius * Math.sin(l) + alt * Math.sin(lat)
     return {x:x, y: y, z: z}
 }

 const clearFlights = () => {
    globe.remove(...globe.children);
 }



