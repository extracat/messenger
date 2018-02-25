function Core() {

    this.allSockets = [];

  


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

this.userIsConnected = function(userId) {

	var found = this.allSockets.find(function(element){
		return element.userId == userId;
	});
	if (found === undefined) {
		return false;
	}
	else {
		return true;
	}
}

this.getSocket = function(userId) {

	var found = this.allSockets.find(function(element){
		return element.userId == userId;
	});
	
	return found.socket;
	
}


this.addSocket = function(socket, userId) {

	if (!this.userIsConnected(socket.decoded_token)) {
 		this.allSockets.push({socket: socket, userId: userId}); 
    }
};

this.removeSocket = function(userId) {

	this.allSockets.some(item => { 
    	if(item.userId === userId) // Case sensitive, will only remove first instance
        this.allSockets.splice(this.allSockets.indexOf(item),1) 
	});
};

this.getConnectedUsers = function(){
	var users = [];
	this.allSockets.forEach(function(item) {
		users.push(item.userId);
	});
	return users;
};

this.emitToUser = function(userId,type,data) { // emit to certain user
	var socket = this.getSocket(userId);
	socket.emit(type, data);
};

this.broadcast = function(userId,type,data) { // emit to all but the user

	this.allSockets.forEach(function(item) {
		if (item.userId != userId) {
			item.socket.emit(type, data);
		}
	});

};

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

}
module.exports = new Core();