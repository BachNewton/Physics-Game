function Gamepad() {
    this.gamepads = {};

    this.update = () => {
        var foundGamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (var id = 0; id < foundGamepads.length; id++) {
            var gamepad = foundGamepads[id];

            if (gamepad !== null) {
                this.gamepads[id] = gamepad;
            }
        }
    };
}