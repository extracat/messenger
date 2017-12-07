// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

module.exports = mongoose.model('User', new Schema({ 
    regDate: { type: Date, default: Date.now },
    username: {type: String, lowercase: true, unique: true},
    email: String,
    password: String
}));


module.exports = mongoose.model('Conversation', new Schema({ 
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

module.exports = mongoose.model('Message', new Schema({ 
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    sentTime: { type: Date, default: Date.now }, 
    deliveredTime: Date,
    readTime: Date,
    converstationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    content: String
}));


