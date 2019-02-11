// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

io.on('connection', (socket) => {
    socket.on('connected', () => {
        console.log('A new player has connected to the serer with ID: ' + socket.id);

        // Ask for a player (that is not THIS player) to give me their boxes
        for (id in io.sockets.sockets) {
            if (id !== socket.id) {
                console.log('ID: ' + socket.id + ' is requesting boxes from ID: ' + id);
                io.sockets.sockets[id].emit('give boxes to', socket.id);
                break;
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('A player has disconnected from the server with ID: ' + socket.id);
        io.sockets.emit('disconnected', socket.id);
    });

    socket.on('player update', (data) => {
        socket.broadcast.emit('player update', {
            id: socket.id,
            position: data.position,
            quaternion: data.quaternion
        });
    });

    socket.on('give boxes to', (data) => {
        console.log('ID: ' + socket.id + ' is giving their boxes to ID: ' + data.id);
        io.sockets.sockets[data.id].emit('receive boxes', data.boxes);
    });
});
