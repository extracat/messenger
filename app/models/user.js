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

module.exports = mongoose.model('Message', new Schema({ 
	from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    sentTime: { type: Date, default: Date.now }, 
    deliveredTime: Date,
    readTime: Date,
    body: String
}));