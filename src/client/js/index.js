import io from 'socket.io-client'

var clientSocket = io()

// Emitir eventos:
/*
clientSocket.emit(nombreEvento, { params })

// Escuchar

clientSocket.on(evento, (datos) => {

})
*/

$('#newUser').click(function(){
  var username = $('name["username"]').val();
  $('#modal').hide();
  clientSocket.emit('newUser', {user: username});
})
