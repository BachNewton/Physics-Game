function Light() {
    this.SHADOW_POWER = 10;

    this.addLightTo = (scene) => {
        var ambientLight = new THREE.AmbientLight('white', 0.5);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight('white', 0.5);
        directionalLight.position.set(100, 100, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = Math.pow(2, this.SHADOW_POWER);
        directionalLight.shadow.mapSize.height = Math.pow(2, this.SHADOW_POWER);
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.top = 100;

        scene.add(directionalLight);

        // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // scene.add(helper);
    }
}
