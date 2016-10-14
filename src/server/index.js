/*
* Dependencias
*/

import http from 'http'
import express from 'express'
import io from 'socket.io'

const port = 8082
const app = express()

app.use(express.static('public'))
const Server = http.createServer(app)

const socketio = io()

socketio.on('connection', (socket) => {
    console.log(`New user connected to the game, id: ${socket.id}`)
})

Server.listen(port, () => console.log(`TitTacToe is ready for play on port ${port}`))