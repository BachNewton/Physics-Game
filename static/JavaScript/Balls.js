function Balls(world, scene) {
    this.bodies = [];
    this.meshes = [];

    this.RADIUS = 0.2;

    this.shape = new CANNON.Sphere(this.RADIUS);
    this.geometry = new THREE.SphereGeometry(this.shape.radius, 32, 32);
    this.material = new THREE.MeshLambertMaterial({ color: 'yellow' });

    this.update = () => {
        for (var i = 0; i < this.bodies.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    };

    this.makeNewBall = (mass, position, velocity) => {
        var body = new CANNON.Body({ mass: mass });
        body.addShape(this.shape);
        body.velocity.copy(velocity);
        body.position.copy(position);

        var mesh = new THREE.Mesh(this.geometry, this.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.copy(position);

        this.bodies.push(body);
        this.meshes.push(mesh);

        world.add(body);
        scene.add(mesh);
    };
}
