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

    this.getNewBody = (width, height, depth, position, quaternion, velocity, angularVelocity) => {
        quaternion = quaternion || new CANNON.Quaternion();
        velocity = velocity || new CANNON.Vec3();
        angularVelocity = angularVelocity || new CANNON.Vec3();

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

    socket.on('boxes', (boxes) => {
        for (var box of boxes) {
            var x = box.x;
            var y = box.y;
            var z = box.z;
            var width = box.width;
            var height = box.height;
            var depth = box.depth;

            var body = this.getNewBody(width, height, depth, { x: x, y: y, z: z });
            var mesh = this.getNewMeshFromBody(body);

            this.bodies.push(body);
            this.meshes.push(mesh);

            world.add(body);
            scene.add(mesh);
        }
    });
}