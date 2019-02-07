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
        const MASS = 5;

        var material = new THREE.MeshLambertMaterial({ color: 'white' });

        var halfExtents = new CANNON.Vec3(1, 1, 1);
        var boxShape = new CANNON.Box(halfExtents);
        var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

        for (var i = 0; i < NUM_OF_BOXES; i++) {
            var x = (Math.random() - 0.5) * 100;
            var y = 1 + (Math.random() * 10);
            var z = (Math.random() - 0.5) * 100;

            var body = new CANNON.Body({ mass: MASS });
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
