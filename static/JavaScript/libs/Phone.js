function Phone() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.camera.position.set(0, 2, 0);
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.scale = 0.0001;
    this.rotation = { alpha: 0, beta: 0, gamma: 0 };
    this.rotationCenter = null;

    this.update = () => {
        this.velocity.addScaledVector(this.acceleration, 0 * this.scale);
        this.camera.position.add(this.velocity);

        networking.socket.emit('phone', this.camera.position);
    };

    this.updateRotationCenter = () => {
        this.rotationCenter = {
            alpha: this.rotation.alpha,
            beta: this.rotation.beta,
            gamma: this.rotation.gamma
        };
    };

    window.addEventListener('devicemotion', (e) => {
        this.acceleration.set(e.acceleration.x, e.acceleration.y, e.acceleration.z);
    });

    window.addEventListener('deviceorientation', (e) => {
        this.rotation.alpha = e.alpha;
        this.rotation.beta = e.beta;
        this.rotation.gamma = e.gamma;

        if (this.rotationCenter !== null) {
            var y = e.alpha - this.rotationCenter.alpha;
            var x = e.beta - this.rotationCenter.beta;
            var z = e.gamma - this.rotationCenter.gamma;

            z *= -Math.PI / 180; // Need to invert
            x *= Math.PI / 180;
            y *= Math.PI / 180;

            this.camera.rotation.set(x, y, z);
        }
    });
}