function Light() {
    this.addLightTo = (scene) => {
        var ambientLight = new THREE.AmbientLight('white', 0.5);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight('white', 0.5);
        directionalLight.position.set(100, 100, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 512 * 4;  // default 512
        directionalLight.shadow.mapSize.height = 512 * 4; // default 512
        // directionalLight.shadow.camera.near = 0.5;    // default
        directionalLight.shadow.camera.far = 300;     // default 500
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.top = 100;

        scene.add(directionalLight);

        // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // scene.add(helper);
    }
}
