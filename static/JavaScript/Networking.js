function Networking() {
    this.socket = io();

    this.socket.emit('connected');

    this.socket.on('message', (data) => {
        console.log(data);
    });
}
