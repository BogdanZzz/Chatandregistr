var User = require('./schema/user').User;
var admin = new User({
	name: 'root',
	password: 'pass@word1'
});
admin.save(function(err){
	if(err) throw err;
});