function Car(world, scene) {
    this.width = 1;
    this.height = 0.75;
    this.depth = 2;
    this.mass = 15;
    this.startingPosition = { x: 0, y: 2, z: -3 };
    this.body;
    this.mesh;

    this.getNewBody = () => {
        var halfExtents = new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2);
        var shape = new CANNON.Box(halfExtents);

        var body = new CANNON.Body({ mass: this.mass });
        body.addShape(shape);

        body.position.copy(this.startingPosition);

        return body;
    };

    this.getNewMesh = () => {
        var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 'orange' }));

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.copy(this.startingPosition);

        return mesh;
    };

    this.addToGame = () => {
        this.body = this.getNewBody();
        this.mesh = this.getNewMesh();

        world.add(this.body);
        scene.add(this.mesh);
    };

    this.update = () => {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    };
}