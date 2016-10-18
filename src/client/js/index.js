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
    this.moves = 0;
    this.wins = 0;
    this.losses = 0;
    this.flagPartida = 0;
    $('#info-partida').hide();
    this.addUser();
    this.gameStarted();
    this.listenChat();
    this.sendChatEvent();

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
      this.players = datos.users;
      if (this.players[0]===this.myUser) {
        $('#opUser').text(this.players[1]);
      }else {
        $('#opUser').text(this.players[0]);
      }
      $('#myUser').text(this.myUser);

      if (this.players[datos.turn-1]===this.myUser) {
        this.marker[0] = 'X';
        this.marker[1] = 'O';
        this.miTurno();
      }else{
        this.marker[0] = 'O';
        this.marker[1] = 'X';
        this.turnoOponente();
      }
    })
  }

  miTurno(){
    $(".mi-turno").addClass('active');
    $('.turno-oponente').removeClass('active');
    if (this.winCheck()==="") {
      this.addGameClick();
    }else {
      this.whoWon();
    }
  }

  turnoOponente(){
    $(".turno-oponente").addClass('active');
    $('.mi-turno').removeClass('active');
    $('.cuadro').off('click');
    if (this.winCheck()==="") {
      this.listenGameClick();
    }else {
      this.whoWon();
    }
  }

  addGameClick(){
    $('.cuadro').on('click', (event) => {
      let element = $(event.target).attr('data-number');
      this.moves++;
      $(event.target).text(this.marker[0]);
      this.clientSocket.emit('movement', {target: element, user: this.myUser});
      this.turnoOponente();
    })
  }

  listenGameClick(){
    this.clientSocket.on('movement', (datos) => {
      $(`.cuadro[data-number='${datos.target}']`).text(this.marker[1]).css('color','#333333');
      this.miTurno();
    })
  }

  listenChat(){
    this.clientSocket.on('message', (datos) => {
      $('.msg-container').append(`
        <div class="msg-cont-rec">
          <div class="msg-recibido">
            <span class="titulo-msg">${datos.user}:</span>
            <span class="msg">${datos.msg}</span>
          </div>
        </div>
        `);
        this.scrollAlwaysDown();
    })
  }
  sendChatEvent(){
    let input = $('[name="input-msg"]');
    $('[name="send"]').on('click', this.writeChat);
    $(input).on('keypress', (event) => {
      if (event.which == 13) {
        event.preventDefault();
        this.writeChat();
      }
    })
  }
  scrollAlwaysDown(){
    let scroller = $(".scroll-container")
    $(scroller).animate({ scrollTop: $(scroller).get(0).scrollHeight }, 500);
  }
  writeChat(){
    let input = $('[name="input-msg"]');
    let mensaje = $(input).val();
    if (mensaje != '') {
      $('.msg-container').append(`
        <div class="msg-cont-env">
        <div class="msg-enviado">
        <span class="titulo-msg">${this.myUser}:</span>
        <span class="msg">${mensaje}</span>
        </div>
        </div>
        `);
        this.scrollAlwaysDown();
        $(input).val('');
        this.clientSocket.emit('message', {user: this.myUser, msg: mensaje});
    }
  }

  winCheck(){

    let cuadros = [];
    if (this.moves < 3) {
      return '';
    }else {
      $.each(document.getElementsByClassName('cuadro'), function(key, value){
        if (key == 0) {
          cuadros[key] = '';
          cuadros[key+1]=  $(value).text();
        }else {
          cuadros[key+1]=  $(value).text();
        }
      })

      if (cuadros[1] ==  cuadros[2] && cuadros[2] == cuadros[3]) {
        return cuadros[1];
      }
      if (cuadros[4] ==  cuadros[5] && cuadros[5] == cuadros[6]) {
        return cuadros[4];
      }
      if (cuadros[7] ==  cuadros[8] && cuadros[8] == cuadros[9]) {
        return cuadros[7];
      }
      if (cuadros[1] ==  cuadros[4] && cuadros[4] == cuadros[7]) {
        return cuadros[1];
      }
      if (cuadros[2] ==  cuadros[5] && cuadros[5] == cuadros[8]) {
        return cuadros[2];
      }
      if (cuadros[3] ==  cuadros[6] && cuadros[6] == cuadros[9]) {
        return cuadros[3];
      }
      if (cuadros[1] ==  cuadros[5] && cuadros[5] == cuadros[9]) {
        return cuadros[1];
      }
      if (cuadros[3] ==  cuadros[5] && cuadros[5] == cuadros[7]) {
        return cuadros[3];
      }
      return '';
    }
  }

  whoWon(){


    if (this.flagPartida===0) {
      let modal = $('#info-partida');
      let resultado = '';
      if(this.winCheck()==this.marker[0]){
        $('#info-partida h2').text('¡Ganaste esta partida!').css('color', '#9B59CF');
        resultado = 'w';
      }else {
        $('#info-partida h2').text('Perdiste esta partida').css('color', '#FF3C3C');
        resultado = 'l';
      }
      $(modal).find('#next-game').on('click', this.restartGame);
      $(modal).show();
      this.updateScore(resultado);
    }
    this.flagPartida++;
  }

  updateScore(resultado){
    if (resultado === 'w') {
      this.wins++;
    }else {
      this.losses++;
    }
    let perWin = ((100/this.wins)+'%').toString();
    let perLoss = ((100/this.losses)+'%').toString();
    $('.number-p1').text(this.wins);
    $('.number-p2').text(this.losses);
    $('.p1').css('width',perWin);
    $('.p2').css('width',perLoss);
  }

  restartGame(){
    $('#info-partida').hide();
    $('.cuadro').text('');
    this.moves = 0;
    this.marker = [];
    this.flagPartida = 0;
    this.clientSocket.emit('restartGame')
  }
}

var init = new TicTacToe();
