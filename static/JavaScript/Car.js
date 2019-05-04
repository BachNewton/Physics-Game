function Car(world, scene) {
    this.MAX_FORCE = 10;
    this.MAX_TURN = Math.PI / 5;
    this.width = 1;
    this.height = 0.75;
    this.depth = 2;
    this.mass = 20;
    this.wheelMass = 5;
    this.body;
    this.mesh;
    this.wheelRadius = 0.3;
    this.wheelMeshes = [];
    this.car;
    this.startingPosition = { x: 0, y: 0.5, z: -3 };
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

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

        mesh.add(this.camera);
        this.camera.translateZ(5);
        this.camera.translateY(3);
        this.camera.rotateX(-Math.PI / 8);

        return mesh;
    };

    this.getNewWheelMesh = () => {
        var geometry = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.25);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 'pink' }));

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    this.addToGame = () => {
        this.body = this.getNewBody();
        this.mesh = this.getNewMesh();

        this.car = new CANNON.RigidVehicle({ chassisBody: this.body });
        var axisWidth = this.width * 1.75;
        var wheelShape = new CANNON.Sphere(this.wheelRadius);
        var downShifted = this.height / 2;
        var down = new CANNON.Vec3(0, -1, 0);

        var frontLeftWheel = new CANNON.Body({ mass: this.wheelMass });
        frontLeftWheel.addShape(wheelShape);
        this.car.addWheel({
            body: frontLeftWheel,
            position: new CANNON.Vec3(-axisWidth / 2, -downShifted, -this.depth / 2),
            axis: new CANNON.Vec3(-1, 0, 0),
            direction: down
        });

        var frontRightWheel = new CANNON.Body({ mass: this.wheelMass });
        frontRightWheel.addShape(wheelShape);
        this.car.addWheel({
            body: frontRightWheel,
            position: new CANNON.Vec3(axisWidth / 2, -downShifted, -this.depth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down
        });

        var backLeftWheel = new CANNON.Body({ mass: this.wheelMass });
        backLeftWheel.addShape(wheelShape);
        this.car.addWheel({
            body: backLeftWheel,
            position: new CANNON.Vec3(-axisWidth / 2, -downShifted, this.depth / 2),
            axis: new CANNON.Vec3(-1, 0, 0),
            direction: down
        });

        var backRightWheel = new CANNON.Body({ mass: this.wheelMass });
        backRightWheel.addShape(wheelShape);
        this.car.addWheel({
            body: backRightWheel,
            position: new CANNON.Vec3(axisWidth / 2, -downShifted, this.depth / 2),
            axis: new CANNON.Vec3(1, 0, 0),
            direction: down
        });

        for (var i = 0; i < 4; i++) {
            var wheelMesh = this.getNewWheelMesh();
            scene.add(wheelMesh);
            this.wheelMeshes.push(wheelMesh);
        }

        this.car.addToWorld(world);
        scene.add(this.mesh);
    };

    this.update = () => {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

        for (var i = 0; i < this.wheelMeshes.length; i++) {
            this.wheelMeshes[i].position.copy(this.car.wheelBodies[i].position);
            this.wheelMeshes[i].quaternion.copy(this.car.wheelBodies[i].quaternion);
            this.wheelMeshes[i].rotateZ(Math.PI / 2);
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp') {
            this.setWheelForce(this.MAX_FORCE);
        } else if (e.code === 'ArrowLeft') {
            this.setSteeringAngle(-this.MAX_TURN);
        } else if (e.code === 'ArrowRight') {
            this.setSteeringAngle(this.MAX_TURN);
        } else if (e.code === 'ArrowDown') {
            this.setWheelForce(-this.MAX_FORCE);
        }
    });

    this.setWheelForce = (force) => {
        this.car.setWheelForce(force, 0);
        this.car.setWheelForce(-force, 1);
        this.car.setWheelForce(force, 2);
        this.car.setWheelForce(-force, 3);
    };

    this.setSteeringAngle = (angle) => {
        this.car.setSteeringValue(angle, 0);
        this.car.setSteeringValue(angle, 1);
    };

    this.accelerate = (percent) => {
        var force = percent * this.MAX_FORCE;

        this.car.applyWheelForce(force, 0);
        this.car.applyWheelForce(-force, 1);
        this.car.applyWheelForce(force, 2);
        this.car.applyWheelForce(-force, 3);
    };

    this.turn = (percent) => {
        var angle = percent * this.MAX_TURN;

        this.car.setSteeringValue(angle, 0);
        this.car.setSteeringValue(angle, 1);
    };

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            this.setWheelForce(0);
        } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            this.setSteeringAngle(0);
        }
    });
}