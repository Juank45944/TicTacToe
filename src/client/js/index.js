import io from 'socket.io-client'
import $ from 'jquery'

var clientSocket = io()

// Emitir eventos:
/*
clientSocket.emit(nombreEvento, { params })

// Escuchar

clientSocket.on(evento, (datos) => {

})
*/



clientSocket.on('newGame', (datos) => {
  console.log(datos);
})

class TicTacToe {

  constructor() {

    this.addUser();
  }

  addUser(){
    $('#newUser').click(function(){
      var username = $("[name='username']").val();
      $('#modal').hide();
      clientSocket.emit('newUser', {user: username});
    })
  }
  
}
