var playerShape, playerBody, world;

var camera, scene, renderer;
var geometry;

var boxes = new Boxes();
var balls = new Balls();

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

initCannon();
init();
animate();

function initCannon() {
    // Setup our world
    world = new CANNON.World();

    // world.quatNormalizeSkip = 0;
    // world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    // world.defaultContactMaterial.contactEquationStiffness = 1e9;
    // world.defaultContactMaterial.contactEquationRelaxation = 4;

    // solver.iterations = 7;
    // solver.tolerance = 0.1;

    var split = true;
    if (split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0, -10, 0);

    // world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    var physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0, // friction coefficient
        0.3  // restitution
    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a player
    var mass = 5, radius = 1.3;
    playerShape = new CANNON.Sphere(radius);
    playerBody = new CANNON.Body({ mass: mass });
    playerBody.addShape(playerShape);
    playerBody.position.set(0, 5, 0);
    playerBody.linearDamping = 0.9;
    world.add(playerBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(groundBody);
}

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    scene = new THREE.Scene();

    scene.background = new THREE.Color('skyblue');

    var light = new Light();
    light.addLightTo(scene);

    controls = new PointerLockControls(camera, playerBody);
    scene.add(controls.getObject());

    // floor
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
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

    window.addEventListener('resize', onWindowResize, false);

    boxes.addTo(world, scene);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var performanceThen = performance.now();
var delta = 1 / 60;
var fires = 0;
function animate() {
    stats.begin();

    requestAnimationFrame(animate);

    if (controls.enabled) {
        world.step(delta);
        balls.updatePositions();
        boxes.updatePositions();

        if (fires < 750) {
            // balls.fireFrom(playerBody, playerShape, world, scene);
            fires++;
        }
    }

    controls.update(performance.now() - performanceThen);
    renderer.render(scene, camera);

    performanceThen = performance.now();

    stats.end();
}

window.addEventListener("click", () => {
    if (controls.enabled == true) {
        balls.fireFrom(playerBody, playerShape, world, scene);
    }
});
