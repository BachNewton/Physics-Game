function Phone() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.velocity = new THREE.Vector3();

    window.addEventListener('devicemotion', (e) => {
        document.getElementById('instructions').innerText = 'test';

        // networking.socket.emit('phone', {
        //     x: e.acceleration.x,
        //     y: e.acceleration.y,
        //     z: e.acceleration.z
        // });
    });

    window.addEventListener('deviceorientation', (e) => {
        document.getElementById('instructions').innerText = 'test';
    });
}