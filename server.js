// =======================
// get the packages we need 
// =======================

var os          = require('os');
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken'); 


// =======================
// configuration 
// =======================

var config = require('./config'); // get our config file

// get our mongoose models
var Conversation  = require('./app/models/conversation');
var User          = require('./app/models/user'); 
var Message       = require('./app/models/message');




var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var socketioJwt = require('socketio-jwt')

var hostname = os.hostname()
var port = process.env.PORT || 3000

mongoose.connect(config.database, {useMongoClient: true}); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////

function addMessage(senderId, conversationId, content, callback) {
  var newMessage = new Message();
  newMessage.senderId = senderId;
  newMessage.conversationId = conversationId;
  newMessage.content = content;

  if (conversationId == null) {
        var newConversation = new Conversation();
        newConversation.participants.push(senderId);
        newConversation.save(function(err, conversation) {
            if (err) return console.error(err);
            newMessage.conversationId = conversation.id
            console.log(newMessage);
            saveMessage(newMessage,callback);
          })
    } else {  
      saveMessage(newMessage,callback);
    }
}

function saveMessage(message,callback){               
    message.save(function(err, message) {
        if (err) return console.error(err);
        if (typeof callback === "function") {callback(message)}
      })
}


function notifyUsers(conversationId) {

}


///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////



// =======================
// socket.io 
// =======================

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: 'supertonyhasasecret',
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', function(socket) {

    // ==============================================
    // this socket is authenticated, we are good to handle more events from it
    // ==============================================

    console.log('a user authenticated: ' + socket.decoded_token);

    socket.on('chatMessage', function(from, msg){
      console.log('chatMessage', socket.decoded_token, msg);

      addMessage(socket.decoded_token, null, msg, function(){})

      io.emit('chatMessage', from, msg);
    });

    socket.on('notifyUser', function(user){
      io.emit('notifyUser', user);
    });


    // ==============================================
  });


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  }); 
});



// =======================
//      REST routes 
// =======================

// basic route
//app.get('/', function(req, res) {res.send('Hello, World!')});
app.use(express.static(path.join(__dirname, 'public')));

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({username: req.body.username}, function(err, user) {

    if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
    } else {

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

          // check if password matches
          if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });

          } else {
            var token = jwt.sign(user.id, app.get('superSecret'));
            // if user is found and password is right
            // return the information including token as JSON
            res.json({
              success: true,
              id: user.id,
              token: token
            });
          }   
        }
  }});
});

// route to sign up new user
apiRoutes.post('/signup', function(req, res) {

  if (req.body.anonymous == true) {
    var newUser = new User();
    newUser.save(function(err, user) {
        if (err) return console.error(err);
        var token = jwt.sign(user.id, app.get('superSecret'));
        res.json({
          success: true,
          id: user.id,  
          token: token
          });
     })
  }
  else {

    if (req.body.username != null && req.body.password != null) {

      User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    success: false,
                    message: "User already exists!"
                });
            } else {
                var newUser = new User();
                newUser.username = req.body.username;
                newUser.password = req.body.password;
               
                newUser.save(function(err, user) {
                        if (err) return console.error(err);

                        var token = jwt.sign(user.id, app.get('superSecret'));
                        res.json({
                            success: true,
                            id: user.id,
                            token: token
                        });
                })
            }
        }
    });
  }

    else {
    res.json({
                success: false,
                message: "Bad request"
            });
  }
 }


});


// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    

      } else {
        User.findById(decoded, function(err, existingUser) {
                if (err) {
                    res.json({
                        success: false,
                        message: "Error occured: " + err
                    });
                } else {
                    if (existingUser && existingUser.id == decoded) {

                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;    
                        next();

                    }
                    else {
                      return res.json({ success: false, message: 'The user does not exist'});    
                    }
                  }
        });
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ id: req.decoded});
});


// =======================
// REST API ROUTES  ======
// =======================

// route to return all users 
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   



apiRoutes.get('/users/:id', function(req, res) {
    
  var id = req.params.id; 
    
  User.findById(id, function(err, user) {
        
    if(user){
        res.json(user);
    }
    else{
        res.status(404).send();
    }
  });
});   


apiRoutes.post('/users', function(req, res) {

    if (req.body.username != null && req.body.password != null) {

      User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    success: false,
                    message: "User already exists!"
                });
            } else {
                var newUser = new User();
                newUser.username = req.body.username;
                newUser.password = req.body.password;
               
                newUser.save(function(err, user) {
                        if (err) return console.error(err);
                        res.json(user);
                })
            }
        }
    });
  }
  else {
    res.json({
                success: false,
                message: "Bad request"
            });
  }


 
}); 


apiRoutes.put('/users/:id', function(req, res) {

  var id = req.params.id; 
    
  User.findByIdAndUpdate(id, {username: req.body.username, password: req.body.password}, function(err, user) {
        
    if(user){
          User.findById(id, function(err, user2) {res.json(user2)});
    }
    else{
        res.status(404).send();
    }
  });
 
});


apiRoutes.delete('/users/:id', function(req, res) {
  var id = req.params.id; 
    
  User.findById(id, function(err, user) {
        
    if(user){
        user.remove(function (err) {
             if (err) return handleError(err);
              res.json(user);    
         });        
    } else {
        res.status(404).send();
    }
  });
}); 
 

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// ========================




// some service APIs

app.get('/setup', function(req, res) {

  User.remove({}, function (err) {
    if (err) return handleError(err);
    return res.json({message: 'Database cleared'});    
  });
});


app.get('/config', function(req, res) {

  res.json({ 
    socket: 'https://extracat-messenger-api.herokuapp.com',
    version: 1
  });
});


// =======================
// start the server ======
// =======================


server.listen(port);
console.log('Server started');
