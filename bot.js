var irc     = require('irc'),
    config  = require('./config.json'),
    util    = require('util'),
    db      = require('./db'),
    cmds    = require('./commands');

var client = new irc.Client(config.irc.server, config.irc.nick, {
    channels: config.irc.channels,
    password: config.irc.password
});

client.addListener('error', function(message) {
    console.log('error: ' + message);
});

client.addListener('message', function(from, to, message) {
    console.log(util.format('%s => %s: %s', from, to, message));
    cmds.process('message', this, from, to, message);
});

client.addListener('pm', function(from, message) {
    cmds.process('pm', this, from, client.nick, message);
});

client.addListener('pm', function(from, message) {
    if(message === '!rehash' ) {
        cmds.rehash();
    }
});
