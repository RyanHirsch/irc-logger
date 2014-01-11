var mongoose = require('mongoose'),
    util = require('util'),
    config = require('./config.json');

var connection_string = util.format(
    'mongodb://%s:%s@%s:%d/%s',
    config.mongo.user,
    config.mongo.password,
    config.mongo.hostname,
    config.mongo.port,
    config.mongo.database
);

mongoose.connect(connection_string);

var IRCLog = mongoose.model('IRCLog', {
    ts:         Date,
    server:     String,
    channel:    String,
    message:    String,
    nick:       String
});

var addLogItem = function(data) {
    var item = new IRCLog(data);
    item.save(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.log = {
    add: addLogItem
};
