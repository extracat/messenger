var socket = io(); 
var token = "";

socket.on('connect', function () {
  $('#messages').append('<li>connected</li>');
  
});

socket.on('authenticated', function () {
  $('#messages').append('<li>authenticated</li>');
});
    
socket.on('unauthorized', function (msg) {
  $('#messages').append('<li>authentication error: ' + msg.message + '</li>');
});

socket.on('disconnect', function () {
  $('#messages').append('<li>disconnected</li>');
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
            socket.connect();
            token = user.token;
            socket.emit('authenticate', {token: token});
            $("#messages").append("<li>User ID: " + user.id + " </li>");
        }
    })
}



function submitfunction(){

  var from = $('#user').val();
  var message = $('#m').val();
  if(message != '') {
  socket.emit('chatMessage', from, message);
}
$('#m').val('').focus();
  return false;
}
function notifyTyping() { 
  var user = $('#user').val();
  socket.emit('notifyUser', user);
}
socket.on('chatMessage', function(from, msg){
  var me = $('#user').val();
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
socket.on('notifyUser', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#notifyUser').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
});
$(document).ready(function(){
  var name = makeid();
  $('#user').val(name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
});
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}