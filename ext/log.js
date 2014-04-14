var winston = require('winston');

function getModName(module){
	return module.filename.split('\\').slice(-2).join('\\');
}

function logger(module){
	return new(winston.Logger)({
		
		transports: [
			new (winston.transports.Console)(
				{colorize: true, label: getModName(module)}
			),
			/*new (winston.transports.File)(
						{filename: __dirname + 'app.log'}
			)*/
		]
		
	});
}
module.exports = logger;