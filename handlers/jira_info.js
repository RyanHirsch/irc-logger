var handle = require('../lib/handle');

handle.message('!info :issue_id', function(clientOpts, msgGroups) {
    console.log('Issue: ' + msgGroups.issue_id);
    clientOpts.bot.say(clientOpts.to, 'I have no info on' + msgGroups.issue_id);
});