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