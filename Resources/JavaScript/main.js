var sphereShape, sphereBody, world, physicsMaterial, walls = [], balls = [], ballMeshes = [];

var camera, scene, renderer;
var geometry;
var time = Date.now();

var boxes = new Boxes();

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

initCannon();
init();
animate();

function initCannon() {
    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0, -20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0, // friction coefficient
        0.3  // restitution
    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

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

    controls = new PointerLockControls(camera, sphereBody);
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

    // // Add linked boxes
    // var size = 0.5;
    // var he = new CANNON.Vec3(size, size, size * 0.1);
    // var boxShape = new CANNON.Box(he);
    // var mass = 0;
    // var space = 0.1 * size;
    // var N = 5, last;
    // var boxGeometry = new THREE.BoxGeometry(he.x * 2, he.y * 2, he.z * 2);
    // var chainMaterial = new THREE.MeshLambertMaterial({ color: 'red' });
    // for (var i = 0; i < N; i++) {
    //     var boxbody = new CANNON.Body({ mass: mass });
    //     boxbody.addShape(boxShape);
    //     var boxMesh = new THREE.Mesh(boxGeometry, chainMaterial);
    //     boxbody.position.set(5, (N - i) * (size * 2 + 2 * space) + size * 2 + space, 0);
    //     boxbody.linearDamping = 0.01;
    //     boxbody.angularDamping = 0.01;
    //     world.add(boxbody);
    //     scene.add(boxMesh);
    //     boxes.push(boxbody);
    //     boxMeshes.push(boxMesh);

    //     if (i != 0) {
    //         // Connect this body to the last one
    //         var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-size, size + space, 0), last, new CANNON.Vec3(-size, -size - space, 0));
    //         var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(size, size + space, 0), last, new CANNON.Vec3(size, -size - space, 0));
    //         world.addConstraint(c1);
    //         world.addConstraint(c2);
    //     } else {
    //         mass = 0.3;
    //     }
    //     last = boxbody;
    // }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    if (controls.enabled) {
        world.step(dt);

        // Update ball positions
        for (var i = 0; i < balls.length; i++) {
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
        }

        boxes.updatePositions();
    }

    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();

    stats.end();
}

var ballShape = new CANNON.Sphere(0.2);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 15;
var projector = new THREE.Projector();
function getShootDir(targetVec) {
    var vector = targetVec;
    targetVec.set(0, 0, 1);
    vector.unproject(camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
    targetVec.copy(ray.direction);
}

var ballMaterial = new THREE.MeshLambertMaterial({ color: 'yellow' });

window.addEventListener("click", function (e) {
    if (controls.enabled == true) {
        var x = sphereBody.position.x;
        var y = sphereBody.position.y;
        var z = sphereBody.position.z;
        var ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(ballShape);
        var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        world.add(ballBody);
        scene.add(ballMesh);
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        getShootDir(shootDirection);
        ballBody.velocity.set(shootDirection.x * shootVelo,
            shootDirection.y * shootVelo,
            shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
        y += shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
        z += shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
        ballBody.position.set(x, y, z);
        ballMesh.position.set(x, y, z);
    }
});
