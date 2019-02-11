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
            this.updatePlayer(data.id, data.position, data.quaternion);
        } else {
            this.createNewPlayer(data.id, data.position, data.quaternion);
        }
    });

    this.createNewPlayer = (id, position, quaternion) => {
        var bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
        var bodyMaterial = new THREE.MeshLambertMaterial({ color: 'purple' });
        var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

        var eyeGeometry = new THREE.SphereGeometry(0.1, 6, 6);
        var eyeMaterial = new THREE.MeshLambertMaterial({ color: 'white' });
        var leftEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
        var rightEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEyeMesh.position.set(-0.25, 0.25, -0.5);
        rightEyeMesh.position.set(0.25, 0.25, -0.5);
        bodyMesh.add(leftEyeMesh);
        bodyMesh.add(rightEyeMesh);

        this.ids[id] = { mesh: bodyMesh };

        this.updatePlayer(id, position, quaternion);

        scene.add(bodyMesh);
    };

    this.updatePlayer = (id, position, quaternion) => {
        this.ids[id].mesh.position.copy(position);
        this.ids[id].mesh.quaternion.copy(quaternion);
    };
}
