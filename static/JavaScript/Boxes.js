function Boxes(socket, world, scene) {
    this.bodies = [];
    this.meshes = [];

    this.boxMaterial = new THREE.MeshLambertMaterial({ color: 'white' });

    this.update = () => {
        for (var i = 0; i < this.bodies.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    };

    this.addToWorldAndScene = () => {
        const NUM_OF_BOXES = 125;

        var material = new THREE.MeshLambertMaterial({ color: 'white' });

        for (var i = 0; i < NUM_OF_BOXES; i++) {
            var x = (Math.random() - 0.5) * 300;
            var y = Math.random() * 50 + 5;
            var z = (Math.random() - 0.5) * 300;

            var width = Math.random() * 5 + 0.1;
            var height = Math.random() * 5 + 0.1;
            var depth = Math.random() * 5 + 0.1;

            var halfExtents = new CANNON.Vec3(width, height, depth);
            var boxShape = new CANNON.Box(halfExtents);
            var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

            var mass = 3 * width * height * depth;

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

    socket.on('give boxes to', (id) => {
        console.log('The server has asked me to give my boxes to ID: ' + id);

        var boxesForServer = [];

        for (var body of this.bodies) {
            boxesForServer.push({
                position: {
                    x: body.position.x,
                    y: body.position.y,
                    z: body.position.z
                },
                quaternion: {
                    w: body.quaternion.w,
                    x: body.quaternion.x,
                    y: body.quaternion.y,
                    z: body.quaternion.z
                },
                velocity: {
                    x: body.velocity.x,
                    y: body.velocity.y,
                    z: body.velocity.z
                },
                angularVelocity: {
                    x: body.angularVelocity.x,
                    y: body.angularVelocity.y,
                    z: body.angularVelocity.z
                },
                shape: {
                    width: body.shapes[0].halfExtents.x * 2,
                    height: body.shapes[0].halfExtents.y * 2,
                    depth: body.shapes[0].halfExtents.z * 2
                }
            });
        }

        console.log('I am giving these boxes to the server:', boxesForServer);

        socket.emit('give boxes to', {
            id: id,
            boxes: boxesForServer
        });
    });

    socket.on('receive boxes', (boxes) => {
        console.log('I have recived boxes:', boxes);

        for (var box of boxes) {
            var body = this.getNewBody(box.shape.width, box.shape.height, box.shape.depth, box.position, box.quaternion, box.velocity, box.angularVelocity);
            var mesh = this.getNewMeshFromBody(body);

            this.bodies.push(body);
            this.meshes.push(mesh);

            world.add(body);
            scene.add(mesh);
        }
    });

    this.getNewBody = (width, height, depth, position, quaternion, velocity, angularVelocity) => {
        var halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
        var boxShape = new CANNON.Box(halfExtents);

        var body = new CANNON.Body({ mass: 1.5 * width * height * depth });
        body.addShape(boxShape);

        body.position.set(position.x, position.y, position.z);
        body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        body.velocity.set(velocity.x, velocity.y, velocity.z);
        body.angularVelocity.set(angularVelocity.x, angularVelocity.y, angularVelocity.z);

        return body;
    };

    this.getNewMeshFromBody = (body) => {
        var width = body.shapes[0].halfExtents.x * 2;
        var height = body.shapes[0].halfExtents.y * 2;
        var depth = body.shapes[0].halfExtents.z * 2;

        var geometry = new THREE.BoxGeometry(width, height, depth);
        var mesh = new THREE.Mesh(geometry, this.boxMaterial);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);

        return mesh;
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
