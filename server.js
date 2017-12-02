// =======================
// get the packages we need 
// =======================

var os = require("os")
var fs = require("fs")
var hostname = os.hostname()

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model



// =======================
// configuration 
// =======================

var port = process.env.PORT || 8080
mongoose.connect(config.database, {useMongoClient: true}); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));



// =======================
// routes 
// =======================


// basic route
app.get('/', function(req, res) {
    res.send('Hello, World!');
});


// API ROUTES -------------------

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


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


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
    }
    else{
        res.status(404).send();
    }
  });
}); 
 


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);



app.get('/setup', function(req, res) {

  User.remove({}, function (err) {
    if (err) return handleError(err);

    return res.json({message: 'All users was removed'});    

  });
  
});


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
