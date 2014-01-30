console.log('Loading join.js');
exports.message = function(options) {
    var bot = options.bot;
    var message = options.message;

    if(message.substr(0,1) !== '#') {
        bot.say(options.to, message + " doesn't seem like a valid channel to me.");
    }
    else {
        bot.join(message);
    }
};
