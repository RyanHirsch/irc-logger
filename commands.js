var _ = require('lodash'),
    fs = require('fs');
var invoke_string = '!log';
var commands = {
//    join    : require('./commands/join'),
//    leave   : require('./commands/leave'),
};

// rehash and reload our commands
var rehash = function(directory) {
    var path = __dirname + '/' + directory,
        hashMatch = new RegExp('^' + path + '/', 'gi');

    _.forEach(require.cache, function(item) {
        if(item.id.match(hashMatch)) {
            delete require.cache[item.id];
        }
    });
    fs.readdir(directory, function(err, files) {
        if(err) console.log('ERROR: ' + err);
        _.forEach(files, function(file) {
            // join, leave, quit
            var fileName = file.substring(0, file.length - 3)
            commands[fileName] = require('./' + directory + '/' + fileName);
        });
    });

};

var processMessage = function(bot, from, to, message) {
    var tokens = message.split(' ');
    if(!_.isArray(tokens) || tokens[0] !== invoke_string) { return; }
    if(commands.hasOwnProperty(tokens[1])) {
        var joinedTokens = _.clone(tokens);
        joinedTokens.shift();
        joinedTokens.shift();
        joinedTokens = joinedTokens.join(' ');

        commands[tokens[1]]({
            bot: bot,
            from: from,
            to: to,
            fullMessage: message,
            message: joinedTokens
        });
    }
}
exports.processMessage = processMessage;
exports.rehash = function() { rehash('commands'); };
// !log leave <channel>
