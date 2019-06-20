function Networking() {
    this.socket = io();

    this.socket.emit('connected');

    document.addEventListener('keydown', (e) => {
        this.socket.emit('key down', e.code);
    });

    document.addEventListener('keyup', (e) => {
        this.socket.emit('key up', e.code);
    });

    document.addEventListener('mousedown', () => {
        this.socket.emit('mouse down');
    });

    document.addEventListener('mouseup', () => {
        this.socket.emit('mouse up');
    });

    this.socket.on('world update', () => {
        console.log('Got an update from the world!');
    });
}
