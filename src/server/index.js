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

io.on('connection', (socket) => {
    console.log(`New user connected to the game, id: ${socket.id}`)

    socket.on('newUser', (user) => {
        currentUsers.push(user)
        if (currentUsers.length === 1) {
            currentRoom = currentUsers[0].name + currentUsers[1].name
            let random = Math.floor(Math.random() * currentUsers.length + 1)
            socket.join(roomName)
            socket.emit('newGame', { users: currentUsers})
            currentUsers = []
        }
    })

    socket.on('movement', (data) => {
        socket.broadcast.to(currentRoom).emit('movement', data)
    })
})

Server.listen(port, () => console.log(`TitTacToe is ready for play on port ${port}`))