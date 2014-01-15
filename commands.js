var _ = require('lodash'),
    fs = require('fs');
var invoke_string = '!log';
var commands = { };

// rehash and reload our commands
var rehash = function(directory) {
    var path = __dirname + '/' + directory;
    clearCache(path);
    loadModulesFrom(directory);
};

var clearCache = function(path) {
    var hashMatch = new RegExp('^' + path + '/', 'gi');

    _.forEach(require.cache, function(item) {
        if(item.id.match(hashMatch)) {
            console.log(item.id);
            delete require.cache[item.id];
        }
    });
};

var loadModulesFrom = function(directory) {
    fs.readdir(directory, function(err, files) {
        if(err) console.log('ERROR: ' + err);

        commands = {};
        _.forEach(files, function(file) {
            // join, leave, quit
            var fileName = file.substring(0, file.length - 3)
            commands[fileName] = require('./' + directory + '/' + fileName);
        });
    });
};

var isToMe = function(bot, firstToken) {
    var m = new RegExp('^' + bot + '[:,\-]?', 'gi');

    if(firstToken.match(m)) {
        console.log('true');
        return true;
    }
    else {
        return false;
    }
};

var processMessage = function(bot, from, to, message) {
    var tokens = message.split(' ');
    if(!_.isArray(tokens) || !(tokens[0] === invoke_string || isToMe(bot.nick, tokens[0]))) { return; }
    if(commands.hasOwnProperty(tokens[1])) {
        var joinedTokens = tokens.slice(2).join(' ');

        commands[tokens[1]]({
            bot: bot,
            from: from,
            to: to,
            fullMessage: message,
            message: joinedTokens
        });
    }
    else {
        bot.say(to, "sorry I don't support " + tokens[1]);
    }
}

if (process.env.NODE_ENV === "test") {
   exports._rehash = rehash;
   exports._clearCache = clearCache;
   exports._loadModulesFrom = loadModulesFrom;
   exports._isToMe = isToMe;
}

loadModulesFrom('./commands');
exports.processMessage = processMessage;
exports.rehash = function() { rehash('commands'); };

// !log leave <channel>
