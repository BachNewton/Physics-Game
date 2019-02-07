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
