var socket = io(); 
var token;
var conversationId;
var myUserId;
var authenticated = false;



socket.on('connect', function () {
  //$('#messages').append('<li>connected</li>');
  console.log('connected\n');

  // Получаем токен из строки URL после "#"
  var hash = window.location.hash.substr(1);
  var result = hash.split('&').reduce(function (result, item) {
    var parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});

  var hash_token = result.token;
  

  // Если там нет токена - пытаемся зарегистрироваться
  if (hash_token === undefined || hash_token === null || hash_token == '' || hash_token == 0) {
      signUp();
  } 
  else { // если есть - логинимся с ним
      token = hash_token;
      socket.connect();
      socket.emit('authenticate', {token: token});
      console.log('token = ' + token + '\n');
  }


});

socket.on('authenticated', function () {
  authenticated = true;
  //$('#messages').append('<li>authenticated</li>');
  console.log('authenticated\n');
});

socket.on('authorized', function () {
  //$('#messages').append('<li>authorized</li>');
  console.log('authorized\n');
});
    
socket.on('unauthorized', function (msg) {
  //$('#messages').append('<li>authentication error: ' + msg.message + '</li>');
  console.log('authentication error: ' + msg.message + '\n');
});

socket.on('disconnect', function () {
  authenticated = false;
  //$('#messages').append('<li>disconnected</li>');
  console.log('disconnected\n');
  //socket.connect();
});

socket.on('message', function(msg){
  
  var senderId = msg.senderId;
  var color = (senderId == myUserId) ? 'green' : '#009afd';
  var from = senderId;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg.text + '</li>');
});

socket.on('onlineUsers', function(list){
  
 console.log(list + '\n');
});

socket.on('userTyping', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#userTyping').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#userTyping').text(''); }, 1000);;
});


/*
$(document).ready(function(){
    $("#signUpBtn").click(signUp);
});


$(document).ready(function(){
    $("#connectBtn").click(function(){
        
        socket.connect();
        socket.emit('authenticate', {token: token});
          
    });
});

$(document).ready(function(){
    $("#disconnectBtn").click(function(){
      socket.disconnect();
    });
});

*/

function signUp() {
    //socket.disconnect();
    $.ajax({
        url: "api/signup",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({anonymous: true}),
        success: function (user) {

            token = user.token;
            myUserId = user.id;

            setName("My ID: " + myUserId);
            insertParam('token', token);

            socket.connect();
            socket.emit('authenticate', {token: token});
            console.log('token = ' + token + '\n');
        }
    })
}



function submitfunction(){

  var message = $('#m').val(); 
  if(message != '') {
  socket.emit('message', myUserId, message, conversationId);
}

$('#m').val('').focus();
  return false;
}
function notifyTyping() { 

  socket.emit('userTyping', myUserId);
}

$(document).ready(function(){


});


// Установка параметров ULR после "#"
function insertParam(key, value) 
{
    window.location.hash = key + "=" + value;
}



function makeUserName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}