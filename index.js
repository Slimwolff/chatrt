const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');

app.use('/', express.static(path.join(__dirname, 'public')))

const server = app.listen(3000, () => {
    console.log("Running");
})

const messages = [];


const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('new connection');

    socket.emit('update_messages', messages);

    socket.on('new_message', (data) => {
        messages.push(data)
        console.log(messages)
        io.emit('update_messages', messages)
    });

    socket.on('typing', (data) => {

        let userTyping = data.user;

        socket.broadcast.emit('user-typing', {userTyping} );

        console.log(`${userTyping} is typing...`)
    })

})