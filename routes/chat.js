exports.get = function(req, res){
    if(req.session.user)
    {
        res.render("chat", {title: "Chat"});  
    }else{
        res.render("register", {title: "Регистрация пользователя"});
    }
    
};



	