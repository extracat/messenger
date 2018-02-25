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
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

}
module.exports = new Core();