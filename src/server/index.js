/*
* Dependencias
*/

import http from 'http'
import express from 'express'
import socketio from 'socket.io'

const port = 8082
const app = express()

app.use(express.static('public'))
const Server = http.createServer(app)

const io = socketio(Server)

var currentUsers = []
var currentRoom = ''
var firstSocket = ''

io.on('connection', (socket) => {
    console.log(`New user connected to the game, id: ${socket.id}`)
    socket.on('newUser', (user) => {
        switch (currentUsers.length) {
            case 0:
                currentUsers.push(user.user)
                currentRoom = user.user
                firstSocket = socket
                break;
            case 1:
                currentUsers.push(user.user)
                currentRoom = currentRoom + user.user
                let random = Math.floor(Math.random() * currentUsers.length + 1)
                socket.join(currentRoom)
                firstSocket.join(currentRoom)
                io.to(currentRoom).emit('newGame', { users: currentUsers, turn: random })
                currentUsers = []
                break;
            default:
                break;
        }
    })

    socket.on('movement', (data) => {
        socket.broadcast.to(currentRoom).emit('movement', data)
    })

    socket.on('message', (message) => {
        socket.broadcast.to(currentRoom).emit('message', message)
    })
})

Server.listen(port, () => console.log(`TitTacToe is ready for play on port ${port}`))