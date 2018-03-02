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
    //result[parts[1]] = parts[2];
    return result;
  }, {});


  var hash_token = result.token;

  

  // Если там нет токена - пытаемся зарегистрироваться
  if (hash_token === undefined || hash_token === null || hash_token == '' || hash_token == 0) {
      signUp();
  } 
  else { // если есть - логинимся с ним
      token = hash_token;
      myUserId = result.myId;
      setName("My ID: " + myUserId);

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
  $('.list-account > .list').empty();
  //$('#messages').append('<li>disconnected</li>');
  console.log('disconnected\n');
  //socket.connect();
});

socket.on('message', function(msg){
  addMessageToChat(msg.senderId, msg.text);
});

socket.on('userStatus', function(data){
    var userId = data.userId;
    var status = data.status;
    if (status == 'online') {
      addUserToList('User ' + userId, userId);
    }
    if (status == 'offline') {
      $('#userId_' + userId).remove();
    }
    console.log('User ' + userId + ' ' + status + '\n');
});


socket.on('onlineUsers', function(list){
  list.forEach(function(item) {
    if (item != myUserId) {
      addUserToList('User ' + item, item);
    }
  });
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
            insertParam(token,myUserId);

            socket.connect();
            socket.emit('authenticate', {token: token});
            console.log('token = ' + token + '\n');
        }
    })
}

function getMyUserData(token) {

    $.ajax({
        url: "api",
        contentType: "application/json",
        method: "GET",
        headers: {"x-access-token": token},
        success: function (user) {

            myUserId = user.id;

            setName("My ID: " + myUserId);

            console.log('myUserId = ' + myUserId + '\n');
        }
    })
}

function sendMessageButton(message){

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
function insertParam(token, myId) 
{
    window.location.hash = "token=" + token + "&myId=" + myId;
}



function makeUserName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}