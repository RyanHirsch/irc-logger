var irc = require('irc'),
    config = require('./config.json'),
    mongoose = require('mongoose'),
    util = require('util');

var client = new irc.Client(config.irc.server, config.irc.nick, {
    channels: config.irc.channels
});

client.addListener('message', function(from, to, message) {
    console.log(util.format('%s => %s: %s', from, to, message));
});
