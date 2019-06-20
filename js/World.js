var CANNON = require('cannon');
var Player = require('./Player')

module.exports = class World {
    constructor(networking) {
        this.FPS = 45;

        this.world = new CANNON.World();
        var solver = new CANNON.GSSolver();
        this.world.solver = new CANNON.SplitSolver(solver);

        this.world.gravity.set(0, -1, 0);

        this.createPlane();

        this.networking = networking;
        this.setupNetworkingListeners();

        this.players = {};

        console.log('A new world has been created!');
    }

    get timeBetweenStepsSec() {
        return 1 / this.FPS;
    }

    begin() {
        setInterval(() => {
            this.world.step(this.timeBetweenStepsSec);

            this.networking.sockets.emit('world update');
        }, this.timeBetweenStepsSec);

        console.log('The world has come to life!');
    }

    createPlane() {
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
    }

    setupNetworkingListeners() {
        this.networking.on('connection', (socket) => {
            socket.on('connected', () => {
                console.log('A new player has connected to the serer with ID:', socket.id);

                var player = new Player();
                this.world.addBody(player.body);
                this.players[socket.id] = player;
            });

            socket.on('disconnect', () => {
                console.log('A player has disconnected from the server with ID:', socket.id);
                // TODO: Remove player
            });

            socket.on('key down', (code) => {
                this.players[socket.id].keyUpdate(code, true);
            });

            socket.on('key up', (code) => {
                this.players[socket.id].keyUpdate(code, false);
            });
        });
    }
}