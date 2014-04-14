var db = require('../ext/db');
var crypt = require('crypto');
var CustomError = require('../ext/error').CustomError;
var schemeUser = db.Schema({
	name:{
		type: String,
		unique: true,
		required: true
	},
	hash:{
		type: String,
		required: true
	},
	salt:{
		type: String,
		required: true
	},
	iteration:{
		type: Number,
		required: true
	},
	created:{
		type: Date,
		default: Date.now
	}
});

schemeUser.methods.getHash = function(password){
	var c = crypt.createHmac('sha1', this.salt);
	for(var i=0; i<this.iteration; i++)
		c = c.update(password);
	return c.digest('hex');
};

schemeUser.virtual('password')
	.set(function(password){
		this.salt = String(Math.random());
		this.iteration = parseInt(Math.random()*10+1);
		this.hash = this.getHash(password);
	})
	.get(function(){
		return this.hash;
	});

schemeUser.methods.checkPassword = function(password){
	return this.getHash(password) === this.hash;
};

schemeUser.statics.checkUser = function(login, pass, retFunc){
	this.findOne({name:login}, function(err, curUser){
			if(!curUser){
				retFunc(new CustomError(401), 'Please, register!');
			}else{
				if(curUser.checkPassword(pass)){
					retFunc(null, null, curUser);
				}else{
					retFunc(new CustomError(401), 'Wrong password');
				}
			}
		});
};
schemeUser.statics.registerUser = function(login, pass, retFunc){
	curUser = new this({name: login, password: pass});
	curUser.save(function(err){
		if(err)
			retFunc(new CustomError(500));
		retFunc(null, null, curUser);	
	});
};
exports.User = db.model('User', schemeUser);


