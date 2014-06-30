var irc         = require('irc'),
    ircConfig   = require('./config/irc.json'),
    util        = require('util'),
    handle      = require('./lib/handle');

require('./handlers');

var client = new irc.Client(ircConfig.server, ircConfig.nick, {
    channels: ircConfig.channels,
    password: ircConfig.password,
    debug: true
});

client.addListener('error', function(message) {
    console.log('error: ' + message);
});

client.addListener('message', function(from, to, text, message) {
    console.log(util.format('%s => %s: %s', from, to, text));
    handle.execute('message', text, {
        bot     : this,
        from    : from,
        to      : to,
        text    : text,
        message : message
    });
});

client.addListener('pm', function(from, text, message) {
    handle.execute('pm', text, {
        bot     : this,
        from    : from,
        text    : text,
        message : message
    });
});