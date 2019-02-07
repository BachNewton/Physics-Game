function Boxes() {
    this.bodies = [];
    this.meshes = [];

    this.updatePositions = () => {
        for (var i = 0; i < this.bodies.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    };

    this.addTo = (world, scene) => {
        const NUM_OF_BOXES = 100;

        var material = new THREE.MeshLambertMaterial({ color: 'white' });

        for (var i = 0; i < NUM_OF_BOXES; i++) {
            var x = (Math.random() - 0.5) * 100;
            var y = Math.random() * 10 + 4;
            var z = (Math.random() - 0.5) * 100;

            var width = Math.random() * 3 + 0.25;
            var height = Math.random() * 3 + 0.25;
            var depth = Math.random() * 3 + 0.25;

            var halfExtents = new CANNON.Vec3(width, height, depth);
            var boxShape = new CANNON.Box(halfExtents);
            var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

            var mass = 2 * width * height * depth;

            var body = new CANNON.Body({ mass: mass });
            body.addShape(boxShape);

            var mesh = new THREE.Mesh(boxGeometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            body.position.set(x, y, z);
            mesh.position.set(x, y, z);

            this.bodies.push(body);
            this.meshes.push(mesh);

            world.add(body);
            scene.add(mesh);
        }
    };
}

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
