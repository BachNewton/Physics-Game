var world = new CANNON.World();
var scene = new THREE.Scene();
var renderer;

var pointerLock = new PointerLock();
var boxes = new Boxes();
var balls = new Balls(world, scene);
var player = new Player(pointerLock, balls);

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

initCannon();
initThree();
var lastTimestamp = 0;
animate(lastTimestamp);

function initCannon() {
    var solver = new CANNON.GSSolver();
    world.solver = new CANNON.SplitSolver(solver);

    world.add(player.body);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(groundBody);
}

function initThree() {
    scene.background = new THREE.Color('skyblue');

    scene.add(player.yawObject);

    var light = new Light();
    light.addLightTo(scene);

    // floor
    var geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    var material = new THREE.MeshLambertMaterial({ color: 'green' });

    var floorMesh = new THREE.Mesh(geometry, material);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    boxes.addTo(world, scene);

    window.addEventListener('resize', () => {
        player.camera.aspect = window.innerWidth / window.innerHeight;
        player.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

function animate(timestamp) {
    stats.begin();

    requestAnimationFrame(animate);

    if (pointerLock.locked) {
        world.step((timestamp - lastTimestamp) / 1000);

        balls.update();
        boxes.update();
        player.update(timestamp - lastTimestamp);
    }

    renderer.render(scene, player.camera);

    lastTimestamp = timestamp;

    stats.end();
}
