var socket = io(); 
var token;
var conversationId;
var myUserId;
var authenticated = false;

socket.on('connect', function () {
  $('#messages').append('<li>connected</li>');
  
});

socket.on('authenticated', function () {
  authenticated = true;
  $('#messages').append('<li>authenticated</li>');
});

socket.on('authorized', function () {
  $('#messages').append('<li>authorized</li>');
});
    
socket.on('unauthorized', function (msg) {
  $('#messages').append('<li>authentication error: ' + msg.message + '</li>');
});

socket.on('disconnect', function () {
  authenticated = false;
  $('#messages').append('<li>disconnected</li>');
});

socket.on('message', function(msg){
  
  var senderId = msg.senderId;
  var color = (senderId == myUserId) ? 'green' : '#009afd';
  var from = senderId;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg.text + '</li>');
});

socket.on('userTyping', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#userTyping').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#userTyping').text(''); }, 1000);;
});


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

function signUp() {
    socket.disconnect();
    $.ajax({
        url: "api/signup",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({anonymous: true}),
        success: function (user) {

            token = user.token;
            myUserId = user.id;

            $("#messages").append("<li>User ID: " + myUserId + " </li>");
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


function makeUserName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}