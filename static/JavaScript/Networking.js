function Networking() {
    this.socket = io();

    this.socket.emit('connected');
}
