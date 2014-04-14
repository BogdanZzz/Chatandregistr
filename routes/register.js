var CustomError = require('../ext/error').CustomError;
var User = require('../schema/user').User;
exports.get = function(req, res){
	res.render("register", {title: "Регистрация пользователя"});
};
exports.post = function(req, res){
	var login = req.body.login;
	var pass = req.body.password;
	User.registerUser(login, pass, function(err, msg, user){
		if(!err){
			req.session.user = user._id;
			res.status(302);
			res.setHeader('Location', '/');
			res.end();
		}else{
			if(err instanceof CustomError){
				err.message = msg;
				res.renderError(err);
			}else{
				return next(err);
			}
		}	
	});
};