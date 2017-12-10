// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

module.exports = mongoose.model('User', new Schema({ 
    regDate: { type: Date, default: Date.now },
    username: {type: String, lowercase: true, unique: true},
    password: String,
    email: String,
    name: String
}));


module.exports = mongoose.model('Conversation', new Schema({ 
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

module.exports = mongoose.model('Message', new Schema({ 
	senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    converstationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, 
    sentTime: { type: Date, default: Date.now }, 
    deliveredTime: Date,
    readTime: Date,
    content: String
}));


