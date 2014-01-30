var _ = require('lodash'),
    fs = require('fs');
var invoke_string = '!log';
var commands = base_commands = {
    all: {
        message: [],
        pm: []
    },
    message: {},
    pm: {}
};

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

        commands = base_commands;
        _.forEach(files, function(file) {
            // join, leave, quit
            var fileName = file.substring(0, file.length - 3)
            var importedCommand = require('./' + directory + '/' + fileName);

            if(fileName === "all") {
                commands[fileName] = importedCommand;
            }
            else {
                _.forEach(['message', 'pm'], function(eventType) {
                    if(importedCommand.hasOwnProperty(eventType)) {
                        commands[eventType][fileName] = importedCommand[eventType];
                    }
                });
            }
        });


        console.log(commands);
    });
};

var isToMe = function(bot, firstToken) {
    var m = new RegExp('^' + bot + '[:,\-]?', 'gi');

    if(firstToken.match(m)) {
        return true;
    }
    else {
        return false;
    }
};

var process = function(eventType, bot, from, to, message) {
    console.log(eventType);
    
    var tokens = message.split(' ');

    _.forEach(commands.all[eventType], function(fn) {
        console.log('calling: commands.all.' + eventType);
        fn({
            bot: bot,
            from: from,
            to: to,
            fullMessage: message
        });
    });

    if(!_.isArray(tokens) || !(eventType === 'pm' || tokens[0] === invoke_string || isToMe(bot.nick, tokens[0]))) { return; }

    if( commands[eventType].hasOwnProperty(tokens[1]) ) {
        console.log('calling: commands.' + eventType + '.' + tokens[1]);

        var joinedTokens = tokens.slice(2).join(' ');

        commands[eventType][tokens[1]]({
            bot: bot,
            from: from,
            to: to,
            fullMessage: message,
            message: joinedTokens
        });
    }
    else if (eventType === 'pm' && commands[eventType].hasOwnProperty(tokens[0])){
        console.log('calling: commands.' + eventType + '.' + tokens[0]);

        var joinedTokens = tokens.slice(1).join(' ');

        commands[eventType][tokens[0]]({
            bot: bot,
            from: from,
            to: to,
            fullMessage: message,
            message: joinedTokens
        });
    }
}

// if (process.env.NODE_ENV === "test") {
//    exports._rehash = rehash;
//    exports._clearCache = clearCache;
//    exports._loadModulesFrom = loadModulesFrom;
//    exports._isToMe = isToMe;
// }

loadModulesFrom('./commands');

exports.process = process;
exports.rehash = function() { rehash('commands'); };

// !log leave <channel>
