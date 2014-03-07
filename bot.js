var irc         = require('irc'),
    ircConfig   = require('./config/irc.json'),
    util        = require('util'),
    db          = require('./db'),
    cmds        = require('./commands');

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
    cmds.process('message', this, from, to, text, message);
});

client.addListener('pm', function(from, text, message) {
    cmds.process('pm', this, from, client.nick, text, message);
});

cmds.rehash();