const { Pool } = require('pg')

class Model {

  constructor() {

		var pool;
		if (process.env.DATABASE_URL === undefined) { // if localhost
		  pool = new Pool({
		    database: 'messenger', 
		  });
		}
		else {  // if heroku
		  pool = new Pool({
		    connectionString: process.env.DATABASE_URL,
		    ssl: true,
		  });
		}

    this.pool = pool;
  }



test(callback) {
		(async () => {
		  const client = await this.pool.connect()
		  try {
		    const res = await client.query('SELECT * FROM test_table')
		    callback(res);

		  } finally {
		    client.release()
		  }
		})().catch(e => console.log(e.stack))
	}

//////////////////////////////////////////////
//                                          //
//          User Funcs                      //
//                                          //
//////////////////////////////////////////////



getUserByUsername(username, callback){
    (async () => {
      const client = await this.pool.connect()
      try {
        const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        callback(res);

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}

getUserById(id, callback){
    (async () => {
      const client = await this.pool.connect()
      try {
        const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        callback(res);

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}

getAllUsers(callback) {
    (async () => {
      const client = await this.pool.connect()
      try {
        const res = await client.query('SELECT * FROM users');
        callback(res);

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}


createUser(username, password, email, name, callback){
    (async () => {
      const client = await this.pool.connect()
      try {

        const res1 = await client.query('SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (res1.rows[0].count == 0) { 
           const res = await client.query('INSERT INTO users(username, password, email, name) VALUES ($1, $2, $3, $4) RETURNING *', [username, password, email, name]);
           callback(res);
        }
        else {
          callback(null,"DB error: username or email dublicate");
        }

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}

editUser(id, username, password, email, name, callback){
    (async () => {
      const client = await this.pool.connect()
      try {

        const res1 = await client.query('SELECT COUNT(*) FROM users WHERE (username = $1 OR email = $2) AND id <> $3', [username, email, id]);
        if (res1.rows[0].count == 0) { 
          const res = await client.query('UPDATE users SET username = $1, password = $2, email = $3, name = $4 WHERE id = $5 RETURNING *', [username, password, email, name, id]);
          callback(res);
        }
        else {
          callback(null,"DB error: username or email dublicate");
        }

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}

deleteUser(id, callback){
    (async () => {
      const client = await this.pool.connect()
      try {
          const res = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
          callback(res);

      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
}



//////////////////////////////////////////////
//                                          //
//          Conversation Funcs              //
//                                          //
//////////////////////////////////////////////



//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

addMessage(senderId, conversationId, content, callback) {
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
            //console.log("conversation created");
            saveMessage(newMessage,callback);
          })
    } else {  
      saveMessage(newMessage,callback);
    }
}

saveMessage(message,callback){               
    message.save(function(err, message) {
        if (err) return console.error(err);        
        if (typeof callback === "function") {callback(message)}
        //console.log("message added: ", message);
      })
}


notifyUsers(sockets, message) {
 Conversation.findById(message.conversationId, function(err, conversation) {
    if (err) return console.error(err);  
    if(conversation){
        
        var participants = conversation.participants;

        participants.forEach(function(userId, i, arr) {
         
           if (userId != message.senderId){
              sendMessage(sockets, userId, message); // Send message to the user
           }

        });

    }
    else{
        console.error("ERROR: conversation was not found!");
    }
  });
}

sendMessage(sockets, userId, message) {
  sockets.forEach(function(socket, i, arr) {
      if (sockets.userId == userId){
              socket.emit('chatMessage', message.senderId, message.content, message.conversationId);
              console.log("message sent to: ", userId);
           }
  });
}


addUserToLonelyConversation(userId) {

    var cursor = Conversation.find({}).cursor();

    // Print every document that matches the query, one at a time
    cursor.on('data', function(conversation) {

      if (conversation.participants.length == 1) {
        cursor.pause(); 
        console.log("lonly conv: ", conversation); 
        conversation.participants.push(userId);
        Conversation.findByIdAndUpdate(conversation.id, conversation, function(err, model) {
           // sending all messages to user
           

        });
       }

    });    
}

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

}
module.exports = new Model();