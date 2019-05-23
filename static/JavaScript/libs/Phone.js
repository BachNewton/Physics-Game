function Phone() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.camera.position.set(0, 5, 0);
    this.controls = new THREE.DeviceOrientationControls(this.camera);
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.scale = 0.001;
    this.speed = 0.1;
    this.fingersOnScreen = 0;

    this.update = () => {
        this.controls.update();

        if (this.fingersOnScreen === 1) {
            this.camera.translateZ(-this.speed);
        } else if (this.fingersOnScreen === 2) {
            this.camera.translateZ(this.speed);
        }

        // this.camera.translateX(this.velocity.x);
        // this.camera.translateY(this.velocity.y);
        // this.camera.translateZ(this.velocity.z);
    };

    window.addEventListener('devicemotion', (e) => {
        this.acceleration.set(e.acceleration.x, e.acceleration.y, e.acceleration.z);
        this.velocity.addScaledVector(this.acceleration, this.scale);
    });

    document.addEventListener('touchstart', (e) => {
        this.fingersOnScreen = e.touches.length;
    });

    document.addEventListener('touchend', (e) => {
        this.fingersOnScreen = e.touches.length;
    });
}