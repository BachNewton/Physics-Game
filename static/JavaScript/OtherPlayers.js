function OtherPlayers(socket, scene) {
    this.ids = {};

    socket.on('disconnected', (id) => {
        if (id in this.ids) {
            scene.remove(this.ids[id].mesh);
            delete this.ids[id];
        }
    });

    socket.on('player update', (data) => {
        if (data.id in this.ids) {
            this.updatePlayer(data.id, data.position, data.rotation);
        } else {
            this.createNewPlayer(data.id, data.position, data.rotation);
        }
    });

    this.createNewPlayer = (id, position, rotation) => {
        var material = new THREE.MeshLambertMaterial({ color: 'purple' });
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, material);

        this.ids[id] = { mesh: mesh };

        this.updatePlayer(id, position, rotation);

        scene.add(mesh);
    };

    this.updatePlayer = (id, position, rotation) => {
        this.ids[id].mesh.position.copy(position);
        this.ids[id].mesh.rotation.set(-rotation.x, -rotation.y, 0);
    };
}
