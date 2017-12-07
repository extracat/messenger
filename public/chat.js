var socket = io(); 

socket.on('connect', function () {
  $('#messages').append('<li>connected</li>');
  socket.emit('authenticate', {token: 'eyJhbGciOiJIUzI1NiJ9.NWEyODQ2OTM0NGU0ZjU1ZjA1MTkyOGEw.R1yQRA38ezvbbyGXHVtXqaHRH3pJFIjjOZTAzNWKxTA'});
});

socket.on('authenticated', function () {
  $('#messages').append('<li>authenticated</li>');
});
    
socket.on('unauthorized', function (msg) {
  $('#messages').append('<li>authentication error: ' + msg.message + '</li>');
});

socket.on('disconnect', function () {
  $('#messages').append('<li>disconnected/li>');
});





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