function PointerLock() {
    this.locked = false;

    var instructions = document.getElementById('instructions');

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
        var blocker = document.getElementById('blocker');
        var element = document.body;

        var pointerLockChange = () => {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                this.locked = true;

                blocker.style.display = 'none';
            } else {
                this.locked = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';

                instructions.style.display = '';
            }
        };

        var pointerLockError = () => {
            instructions.style.display = '';
        };

        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

        document.addEventListener('pointerlockerror', pointerLockError, false);
        document.addEventListener('mozpointerlockerror', pointerLockError, false);
        document.addEventListener('webkitpointerlockerror', pointerLockError, false);

        instructions.addEventListener('click', () => {
            instructions.style.display = 'none';

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            var fullScreenChange = () => {
                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                    document.removeEventListener('fullscreenchange', fullScreenChange);
                    document.removeEventListener('mozfullscreenchange', fullScreenChange);
                    element.requestPointerLock();
                }
            };

            document.addEventListener('fullscreenchange', fullScreenChange, false);
            document.addEventListener('mozfullscreenchange', fullScreenChange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();

            element.requestPointerLock();
        }, false);
    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}
