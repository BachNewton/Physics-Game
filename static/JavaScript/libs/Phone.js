function Phone() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.camera.position.set(0, 5, 0);
    this.controls = new THREE.DeviceOrientationControls(this.camera);
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.scale = 0.0001;

    this.update = () => {
        this.velocity.addScaledVector(this.acceleration, this.scale);
        this.camera.position.add(this.velocity);

        networking.socket.emit('phone', this.camera.position);
    };

    window.addEventListener('devicemotion', (e) => {
        this.acceleration.set(e.acceleration.x, e.acceleration.y, e.acceleration.z);
    });
}