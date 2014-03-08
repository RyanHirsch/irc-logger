var mongoose    = require('mongoose'),
    util        = require('util'),
    mongoConfig = require('./config/mongodb.json');

var connection_string = util.format(
    'mongodb://%s:%s@%s:%d/%s',
    mongoConfig.user,
    mongoConfig.password,
    mongoConfig.hostname,
    mongoConfig.port,
    mongoConfig.database
);
if(connection_string.indexOf("localhost") !== -1 ) {
    connection_string = connection_string.replace('undefined:undefined@', '');
}
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
