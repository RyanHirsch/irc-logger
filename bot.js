var irc     = require('irc'),
    config  = require('./config.json'),
    util    = require('util'),
    db      = require('./db');

var client = new irc.Client(config.irc.server, config.irc.nick, {
    channels: config.irc.channels
});

client.addListener('error', function(message) {
    console.log('error: ' + message);
});

client.addListener('message', function(from, to, message) {
    console.log(util.format('%s => %s: %s', from, to, message));
    db.log.add({
        ts:         new Date(),
        server:     this.opt.server,
        channel:    to,
        nick:       from,
        message:    message
    });
});

