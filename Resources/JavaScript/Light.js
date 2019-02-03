function Light() {
    this.addLightTo = (scene) => {
        var ambientLight = new THREE.AmbientLight('white', 0.5);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight('white', 0.5);
        directionalLight.position.set(1, 1, 0);
        scene.add(directionalLight);
    }
}
