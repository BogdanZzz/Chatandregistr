exports.get = function(req, res){
	req.session.destroy();
	res.status(302);
	res.setHeader('Location', '/');
	res.end();
};