function Player(pointerLock, balls) {
    this._getCannonBody = () => {
        var mass = 5;
        var radius = 1;

        var shape = new CANNON.Sphere(radius);
        var body = new CANNON.Body({ mass: mass });
        body.addShape(shape);
        body.position.set(0, 1, 0);

        return body;
    };

    this._setObjectChildren = () => {
        this.pitchObject.add(this.camera);
        this.lookingAt.translateZ(-2);
        this.pitchObject.add(this.lookingAt);
        this.yawObject.add(this.pitchObject);
        this.facing.translateZ(-1);
        this.yawObject.add(this.facing);
        this.leftSide.translateX(-1);
        this.yawObject.add(this.leftSide);
        this.yawObject.translateY(1);
    };

    this.body = this._getCannonBody();

    this.speed = 0.01;

    this.input = {
        forward: false,
        back: false,
        left: false,
        right: false,
        up: false,
        down: false
    };

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.yawObject = new THREE.Object3D();
    this.pitchObject = new THREE.Object3D();
    this.facing = new THREE.Object3D();
    this.leftSide = new THREE.Object3D();
    this.lookingAt = new THREE.Object3D();
    this._setObjectChildren();

    this.facingWorldPosition = new THREE.Vector3();
    this.facingDirection = new THREE.Vector3();
    this.leftSideWorldPosition = new THREE.Vector3();
    this.leftSideDirection = new THREE.Vector3();
    this.lookingAtWorldPosition = new THREE.Vector3();
    this.lookingAtDirection = new THREE.Vector3();

    this.updateLookingAtDirection = () => {
        this.lookingAt.getWorldPosition(this.lookingAtWorldPosition);
        this.lookingAtDirection.copy(this.lookingAtWorldPosition);
        this.lookingAtDirection.sub(this.yawObject.position);
        this.lookingAtDirection.normalize();
    };

    this.updateFacingDirection = () => {
        this.facing.getWorldPosition(this.facingWorldPosition);
        this.facingDirection.copy(this.facingWorldPosition);
        this.facingDirection.sub(this.yawObject.position);
        // Don't need to normalize, already length of 1
    };

    this.updateLeftSideDirection = () => {
        this.leftSide.getWorldPosition(this.leftSideWorldPosition);
        this.leftSideDirection.copy(this.leftSideWorldPosition);
        this.leftSideDirection.sub(this.yawObject.position);
        // Don't need to normalize, already length of 1
    };

    this.update = (delta) => {
        this.updateFacingDirection();
        this.updateLeftSideDirection();

        this.facingDirection.multiplyScalar(this.speed * delta);
        this.leftSideDirection.multiplyScalar(this.speed * delta);

        if (this.input.forward) {
            this.body.velocity.x += this.facingDirection.x;
            this.body.velocity.z += this.facingDirection.z;
        }

        if (this.input.left) {
            this.body.velocity.x += this.leftSideDirection.x;
            this.body.velocity.z += this.leftSideDirection.z;
        }

        if (this.input.right) {
            this.body.velocity.x += -this.leftSideDirection.x;
            this.body.velocity.z += -this.leftSideDirection.z;
        }

        if (this.input.back) {
            this.body.velocity.x += -this.facingDirection.x;
            this.body.velocity.z += -this.facingDirection.z;
        }

        if (this.input.up) {
            this.body.velocity.y += this.speed * delta;
        }

        if (this.input.down) {
            this.body.velocity.y += -this.speed * delta;
        }

        this.yawObject.position.copy(this.body.position);
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
            this.input.forward = true;
        } else if (e.code === 'KeyA') {
            this.input.left = true;
        } else if (e.code === 'KeyS') {
            this.input.back = true;
        } else if (e.code === 'KeyD') {
            this.input.right = true;
        } else if (e.code === 'Space') {
            this.input.up = true;
        } else if (e.code === 'ShiftLeft') {
            this.input.down = true;
        }
    }, false);

    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') {
            this.input.forward = false;
        } else if (e.code === 'KeyA') {
            this.input.left = false;
        } else if (e.code === 'KeyS') {
            this.input.back = false;
        } else if (e.code === 'KeyD') {
            this.input.right = false;
        } else if (e.code === 'Space') {
            this.input.up = false;
        } else if (e.code === 'ShiftLeft') {
            this.input.down = false;
        }
    }, false);

    document.addEventListener('mousemove', (e) => {
        if (pointerLock.locked) {
            var movement = {
                x: e.movementX || e.mozMovementX || e.webkitMovementX || 0,
                y: e.movementY || e.mozMovementY || e.webkitMovementY || 0
            };

            this.yawObject.rotateY(-movement.x * 0.002);

            this.pitchObject.rotateX(-movement.y * 0.002);
            this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
        }
    }, false);

    document.addEventListener('mousedown', () => {
        if (pointerLock.locked) {
            this.updateLookingAtDirection();
            this.lookingAtDirection.multiplyScalar(15);
            this.lookingAtDirection.add(this.body.velocity);

            balls.makeNewBall(1, this.lookingAtWorldPosition, this.lookingAtDirection);
        }
    });
}
