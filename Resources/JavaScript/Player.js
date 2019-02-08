function Player(pointerLock) {
    this.speed = 0.0075;

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

    this.pitchObject.add(this.camera);
    this.pitchObject.translateY(2);
    this.yawObject.add(this.pitchObject);

    this.addTo = (scene) => {
        scene.add(this.yawObject);
    };

    this.update = (delta) => {
        if (this.input.forward) {
            this.yawObject.translateZ(-this.speed * delta);
        }

        if (this.input.left) {
            this.yawObject.translateX(-this.speed * delta);
        }

        if (this.input.right) {
            this.yawObject.translateX(this.speed * delta);
        }

        if (this.input.back) {
            this.yawObject.translateZ(this.speed * delta);
        }

        if (this.input.up) {
            this.yawObject.translateY(this.speed * delta);
        }

        if (this.input.down) {
            this.yawObject.translateY(-this.speed * delta);
        }
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
}
