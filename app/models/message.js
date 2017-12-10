// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

module.exports = mongoose.model('Message', new Schema({ 
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, 
    sentTime: { type: Date, default: Date.now }, 
    deliveredTime: Date,
    readTime: Date,
    content: String
}));



