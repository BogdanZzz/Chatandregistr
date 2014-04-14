var http = require('http');
var util = require('util');

function CustomError(status, message){
	this.status = status;
	this.message = message || http.STATUS_CODES[status];
}
util.inherits(CustomError, Error);
CustomError.prototype.name = 'CustomError';

exports.CustomError = CustomError;