
/**
 * Module dependencies.
 */
var port = process.env.VMC_APP_PORT || 8080;
var express = require('express');
var http = require('http');
var path = require('path');
var CustomError = require('./ext/error').CustomError;
var conf = require('./config');
var log = require('./ext/log')(module);

var app = express();
// all environments
app.set('views', path.join(__dirname, conf.get('app-views')));
app.set('view engine', conf.get('app-engine'));
app.engine('ejs', require('ejs-locals'));
app.use(express.logger(conf.get('log-level')));
app.use(express.json());
app.use(express.urlencoded());

app.use(express.cookieParser());
app.use(express.session({
	secret: conf.get('session:secret'),
	key: conf.get('session:key'),
	cookie: conf.get('session:cookie')
}));
exports.mongoosefunc = function(){
    if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb2-2.4.8'][0]['credentials'];
    }
    else{
    mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"db"
    }
    }
    var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    }
    mongourl = generate_mongo_url(mongo);
	
}

app.use(express.static(path.join(__dirname, conf.get('app-static'))));
app.use(require('./routes/error'));
app.use(require('./ext/checkSession'));
require('./routes')(app);


app.use(function(err, req, res, next){
	if(typeof err == 'number'){
		res.renderError(new CustomError(err));
	}else{
		// development only
		if ('development' == app.get('env')) {
			express.errorHandler()(err, req, res, next);
		}else{
			log.error(err);	
			res.renderError(new CustomError(500));
		}
	}
});



/* app.get('/test', function(req, res, next){
	log.info('Hello from log!');
	res.end('The end');
});

app.get('/', routes.index);
app.get('/users', user.list); */

var io = require('socket.io').listen(app.listen(port));
var users = {};
function getUsers(obj){
	var tmp = [];
	for(var i in obj)
		tmp.push(obj[i]);
	return tmp.join(', ');
}


io.sockets.on('connection', function(client){
	client.on('hello', function(data){
		client.set('nickname', data.name);
		client.emit('message', {message: '---Добро пожаловать в чат '+data.name+ '!---'});
		client.broadcast.emit('message', {message: '--- '+data.name+' присоединился к чату!---'});
		//io.sockets.emit('message', {message: data.message});
		if(Object.keys(users).length > 0){
			var userList = getUsers(users);
			client.emit('message', {message: '--- Уже в чате:'+userList+' ---'});
		}else{
			client.emit('message', {message: '--- Кроме вас в чате никого нет :( ---'});
		}
		users[client.id] = data.name;
	});
	client.on('disconnect', function(){
		if(Object.keys(users).length > 1){
			client.get('nickname', function(err, name){
				client.broadcast.emit('message', {message: '--- '+name+' покинул чату!---'});
			});
		}
	delete users[client.id];
});
	client.on('send', function(data){
		client.get('nickname', function(err, name){
			io.sockets.emit('message', {message: name+': '+data.message});
		});
		//io.sockets.emit('message', {message: data.message});
	});
});


