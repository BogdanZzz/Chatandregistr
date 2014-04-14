exports.get = function(req, res){
	var name = 'Гость';
	if(req.user){
		name = req.user.name;
	}
	res.render("index", {title: "Наш сайт", name: name});
};