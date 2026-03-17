/**
 * Animated Rhombic Dodecahedron — Three.js hero visualization
 * Adapted from rhombic/website/rd.js for tasumermaf.com
 */
(function() {
  var container = document.getElementById('rd-canvas');
  if (!container || typeof THREE === 'undefined') return;

  var FCC_COLOR = 0xB34444;
  var CUBIC_COLOR = 0x3D3D6B;
  var EDGE_COLOR = 0x444466;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(4, 3, 4);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var cubeVerts = [
    [-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],
    [1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1]
  ];
  var octaVerts = [
    [-2,0,0],[2,0,0],[0,-2,0],[0,2,0],[0,0,-2],[0,0,2]
  ];

  var edges = [];
  for (var ci = 0; ci < cubeVerts.length; ci++) {
    var c = cubeVerts[ci];
    for (var oi = 0; oi < octaVerts.length; oi++) {
      var o = octaVerts[oi];
      var dx = c[0]-o[0], dy = c[1]-o[1], dz = c[2]-o[2];
      if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 2.0) edges.push([ci, 8+oi]);
    }
  }

  var group = new THREE.Group();
  var cubeMat = new THREE.MeshPhongMaterial({color:FCC_COLOR,emissive:FCC_COLOR,emissiveIntensity:0.3});
  var sphereGeo = new THREE.SphereGeometry(0.09,16,16);
  cubeVerts.forEach(function(v){
    var mesh = new THREE.Mesh(sphereGeo, cubeMat);
    mesh.position.set(v[0],v[1],v[2]);
    group.add(mesh);
  });

  var octaMat = new THREE.MeshPhongMaterial({color:CUBIC_COLOR,emissive:CUBIC_COLOR,emissiveIntensity:0.3});
  var diamondGeo = new THREE.OctahedronGeometry(0.14,0);
  octaVerts.forEach(function(v){
    var mesh = new THREE.Mesh(diamondGeo, octaMat);
    mesh.position.set(v[0],v[1],v[2]);
    group.add(mesh);
  });

  var allVerts = cubeVerts.concat(octaVerts);
  var edgeMat = new THREE.LineBasicMaterial({color:EDGE_COLOR,transparent:true,opacity:0.5});
  edges.forEach(function(e){
    var geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(allVerts[e[0]][0],allVerts[e[0]][1],allVerts[e[0]][2]),
      new THREE.Vector3(allVerts[e[1]][0],allVerts[e[1]][1],allVerts[e[1]][2])
    ]);
    group.add(new THREE.Line(geo, edgeMat));
  });

  var cubeEdgeMat = new THREE.LineBasicMaterial({color:FCC_COLOR,transparent:true,opacity:0.1});
  [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]].forEach(function(e){
    var geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(cubeVerts[e[0]][0],cubeVerts[e[0]][1],cubeVerts[e[0]][2]),
      new THREE.Vector3(cubeVerts[e[1]][0],cubeVerts[e[1]][1],cubeVerts[e[1]][2])
    ]);
    group.add(new THREE.Line(geo, cubeEdgeMat));
  });

  scene.add(group);
  scene.add(new THREE.AmbientLight(0x333344, 0.5));
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0015;
    group.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
