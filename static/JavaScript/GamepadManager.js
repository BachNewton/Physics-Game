function GamepadManager() {
    this.input = new Gamepad();
    this.DEADZONE = 0.3;
    this.controller = {
        button: {
            A: false,
            B: false
        },
        leftStick: {
            x: 0,
            y: 0
        },
        rightStick: {
            x: 0,
            y: 0
        },
        rightTrigger: 0,
        leftTrigger: 0
    };

    this.update = () => {
        this.input.update();

        var gamepad = this.getXboxGamepad();

        if (gamepad !== null) {
            this.controller.leftStick.x = gamepad.axes[0];
            this.controller.leftStick.y = gamepad.axes[1];
            this.controller.rightStick.x = gamepad.axes[2];
            this.controller.rightStick.y = gamepad.axes[3];

            this.controller.leftTrigger = gamepad.buttons[6].value;
            this.controller.rightTrigger = gamepad.buttons[7].value;
        }
    };

    this.getXboxGamepad = () => {
        var gamepads = this.input.gamepads;

        for (var id in gamepads) {
            var gamepad = gamepads[id];

            if (gamepad.id.indexOf('Xbox') !== -1) {
                return gamepad;
            }
        }

        return null;
    };

    this.getMovementVector = () => {
        return this.getVector(this.controller.leftStick);
    };

    this.getAimVector = () => {
        return this.getVector(this.controller.rightStick);
    };

    this.getVector = (stick) => {
        if (Math.abs(stick.x) > this.DEADZONE || Math.abs(stick.y) > this.DEADZONE) {
            return stick;
        } else {
            return false;
        }
    };
}