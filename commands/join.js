console.log('Loading join.js');
module.exports = function(options) {
    options.bot.say(options.to, options.message);
    console.log('JOIN: ' + options);
};
