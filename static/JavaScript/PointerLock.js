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

        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

        var lockPointer = () => {
            instructions.style.display = 'none';

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        };

        instructions.addEventListener('click', () => {
            lockPointer();
        }, false);

        instructions.addEventListener('touchstart', () => {
            lockPointer();
            blocker.style.display = 'none';
        });
    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}
