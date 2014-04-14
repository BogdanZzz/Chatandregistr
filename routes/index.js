var CustomError = require('../ext/error').CustomError;

module.exports = function(app){
	
	app.get('/', require("./default").get);
	
	app.get('/login', require("./login").get);
	app.get('/register', require("./register").get);
	app.get('/logout', require("./logout").get);
	app.get('/chat', require("./chat").get);
	
	app.post('/login', require("./login").post);
	app.post('/register', require("./register").post);
	
	
	
	app.use(function(req, res){
		res.renderError(new CustomError(404));
	});
}