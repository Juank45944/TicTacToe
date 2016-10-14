import io from 'socket.io-client'
import $ from 'jquery'

//var clientSocket = io()

// Emitir eventos:
/*
clientSocket.emit(nombreEvento, { params })

// Escuchar

clientSocket.on(evento, (datos) => {

})
// */
//
// $('#newUser').click(function(){
//   var username = $("[name='username']").val();
//   $('#modal').hide();
//   clientSocket.emit('newUser', {user: username});
// })
//
//
// clientSocket.on('newGame', (datos) => {
//   console.log(datos);
// })

class TicTacToe {

  constructor() {
    this.myUser = '';
    this.players = [];
    this.clientSocket = io();
    this.marker = [];
    this.addUser();
    this.gameStarted();
  }

  addUser(){
    $('#newUser').click(() => {
      this.myUser = $("[name='username']").val();
      $('#modal').hide();
      this.clientSocket.emit('newUser', {user: this.myUser});
    })
  }

  gameStarted(){
    this.clientSocket.on('newGame', (datos) => {
      console.log(datos);
      this.players = datos.users;
      if (this.players[datos.turn]===this.myUser) {
        this.marker[0] = 'X';
        this.marker[1] = 'O';
        miTurno();
      }else{
        this.marker[0] = 'O';
        this.marker[1] = 'X';
        turnoOponente();
      }
    })
  }

  miTurno(){
    $(".mi-turno").addClass('active');
    $('.turno-oponente').removeClass('active');
    this.addGameClick();
  }
  turnoOponente(){
    $(".turno-oponente").addClass('active');
    $('.mi-turno').removeClass('active');
    $('.cuadro').off('click');
    this.listenGameClick();
  }

  addGameClick(){
    $('.cuadro').on('click', (event) => {
      let element = $(event.target).attr('data-number');
      $(event.target).text(this.marker[0]);
      this.clientSocket.emit('movement', {target: element, user: this.myUser});
      this.turnoOponente();
    })
  }
  listenGameClick(){
    this.clientSocket.on('movement', (datos) => {
      $(`.cuadro[data-number='${datos.target}']`).text(this.marker[1]).css('color','#333');
      this.miTurno();
    })
  }

}

var init = new TicTacToe();
