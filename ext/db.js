var conf = require('../config');
var md = require('../app.js');
md.mongoosefunc();
var db = require('mongoose');
db.connect(mongourl);
module.exports = db;