function Balls() {
    this.bodies = [];
    this.meshes = [];

    this.MASS = 1;

    this.shape = new CANNON.Sphere(0.2);
    this.geometry = new THREE.SphereGeometry(this.shape.radius, 16, 16);
    this.material = new THREE.MeshLambertMaterial({ color: 'yellow' });

    this.shootDirection = new THREE.Vector3();
    this.shootSpeed = 15;

    this.updatePositions = () => {
        for (var i = 0; i < this.bodies.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    };

    this.updateFireDirection = (playerBody) => {
        this.shootDirection.set(0, 0, 1);
        this.shootDirection.unproject(camera);
        var ray = new THREE.Ray(playerBody.position, this.shootDirection.sub(playerBody.position).normalize());
        this.shootDirection.copy(ray.direction);
    };

    this.fireFrom = (playerBody, playerShape, world, scene) => {
        var x = playerBody.position.x;
        var y = playerBody.position.y;
        var z = playerBody.position.z;

        var body = new CANNON.Body({ mass: this.MASS });
        body.addShape(this.shape);

        var mesh = new THREE.Mesh(this.geometry, this.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.updateFireDirection(playerBody);

        var shootVelocity = this.shootDirection.clone();
        shootVelocity.multiplyScalar(this.shootSpeed);
        body.velocity.copy(shootVelocity);

        // Move the ball outside the player sphere
        x += this.shootDirection.x * (playerShape.radius * 1.02 + this.shape.radius);
        y += this.shootDirection.y * (playerShape.radius * 1.02 + this.shape.radius);
        z += this.shootDirection.z * (playerShape.radius * 1.02 + this.shape.radius);

        body.position.set(x, y, z);
        mesh.position.set(x, y, z);

        this.bodies.push(body);
        this.meshes.push(mesh);

        world.add(body);
        scene.add(mesh);
    };
}
