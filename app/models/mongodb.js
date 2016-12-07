var mongoose = require('mongoose');
var config = require('../../routes/config');
mongoose.connect(config.db);

module.exports = mongoose;