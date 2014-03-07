var _   = require('lodash'),
    fs  = require('fs'),
    Q   = require('q');

var invoke_string = '!log';
var commands = {
    all: {
        message: [],
        pm: []
    },
    message: {},
    pm: {}
};
var base_commands = commands;

// rehash and reload our commands
var rehash = function(directory) {
    if(typeof directory === 'undefined') {
        directory = 'commands';
    }
    var path = __dirname + '/' + directory;
    clearCache(path);
    return loadModulesFrom(path);
};

var clearCache = function(path) {
    var hashMatch = new RegExp('^' + path + '/', 'gi');

    _.forEach(require.cache, function(item) {
        if(item.id.match(hashMatch)) {
            delete require.cache[item.id];
        }
    });
};

var loadModulesFrom = function(directory) {
    var deferred = Q.defer();
    fs.readdir(directory, function(err, files) {
        if(err) {
            console.error('ERROR: ' + err);
            deferred.reject(err);
        }

        commands = base_commands;
        _.forEach(files, function(file) {
            // join, leave, quit
            var fileName = file.substring(0, file.length - 3);
            var importedCommand = require(/*'./' + */directory + '/' + fileName);

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
        deferred.resolve(commands);
    });
    return deferred.promise;
};

var isToMe = function(bot, firstToken) {
    var m = new RegExp('^' + bot + '[:,-]?', 'gi');

    if(firstToken.match(m)) {
        return true;
    }
    else {
        return false;
    }
};

var process = function(eventType, bot, from, to, text, message) {
    var tokens = text.split(' '),
        joinedTokens;

    _.forEach(commands.all[eventType], function(fn) {
        fn({
            bot: bot,
            from: from,
            to: to,
            text: text,
            message: message
        });
    });

    if(!_.isArray(tokens) || (tokens[0] !== invoke_string)) { return; }

    if( commands[eventType].hasOwnProperty(tokens[1]) ) {
        joinedTokens = tokens.slice(2).join(' ');

        commands[eventType][tokens[1]]({
            bot: bot,
            from: from,
            to: to,
            text: text,
            command: joinedTokens,
            message: message
        });
    }
    else if (eventType === 'pm' && commands[eventType].hasOwnProperty(tokens[0])){
        console.log('calling: commands.' + eventType + '.' + tokens[0]);

        joinedTokens = tokens.slice(1).join(' ');

        commands[eventType][tokens[0]]({
            bot: bot,
            from: from,
            to: to,
            text: text,
            message: message,
            command: joinedTokens
        });
    }
};

// if (process.env.NODE_ENV === "test") {
//    exports._rehash = rehash;
//    exports._clearCache = clearCache;
//    exports._loadModulesFrom = loadModulesFrom;
//    exports._isToMe = isToMe;
// }

// loadModulesFrom('./commands');
// rehash();

exports.process     = process;
exports.rehash      = rehash;

// !log leave <channel>
