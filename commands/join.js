console.log('Loading join.js');
var join = function(options) {
    var bot = options.bot;
    var text = options.text;

    if(text.substr(0,1) !== '#') {
        bot.say(options.to, text + " doesn't seem like a valid channel to me.");
    }
    else {
        bot.join(text);
    }
};

var joinPM = function(options) {
    var bot = options.bot;
    var text = options.text;

    if(text.substr(0,1) !== '#') {
        bot.say(options.from, text + " doesn't seem like a valid channel to me.");
    }
    else {
        bot.join(text);
    }
};

exports.message = join;
exports.pm      = joinPM;
