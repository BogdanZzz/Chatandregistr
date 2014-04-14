module.exports = function(req, res, next){
	res.renderError = function(err){
		res.status(err.status);
		res.render("error", {error: err, title: 'Ошибка'});
	};
	next();
};