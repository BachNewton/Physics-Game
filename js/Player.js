var CANNON = require('cannon');

module.exports = class Player {
    constructor() {
        this.mass = 5;
        this.radius = 1;
        this.body = new CANNON.Body({ mass: this.mass });
        this.keysDown = {};
        this.mouseDown = false;

        var shape = new CANNON.Sphere(this.radius);
        this.body.addShape(shape);

        this.body.position.set(0, 1, 0);

        console.log('A new player has been created!');
    }

    keyUpdate(code, isDown) {
        this.keysDown[code] = isDown;
    }

    mouseUpdate(isDown) {
        this.mouseDown = isDown;
    }
}