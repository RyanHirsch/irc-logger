var _   = require('lodash'),
    fs  = require('fs'),
    Q   = require('q');

var handlers =  {
	message: [],
	pm: []
};

var parse = function(input) {
	var tokenized = input.split(' ');
	var obj = {};

	var namedGroup = [];
	_.forEach(tokenized, function(token, idx) {
		if(token.substr(0,1) === ':') {
			var captureGroupPosition = namedGroup.length;
			namedGroup.push(token.substr(1));
			tokenized[idx] = '(.+?)';	//make non-greedy
		}
	});

	obj.groups = namedGroup;

	//the $ forces any final captured groups to be greedy
	obj.regex = tokenized.join(' ') + '$';

	return obj;
};

var attachHandler = function(event, pattern, callback) {
	var obj = parse(pattern);
	obj.fn = callback;

	handlers[event].push(obj);
};

var process = function(event, message, rawClientOpts) {
	_.forEach(handlers[event], function(handler) {
		var matches = message.match(handler.regex);
		if(matches) {
			var groupedResults = matches.slice(1);
			var messageGroups = {};
			_.forEach(groupedResults, function(groupResult, idx) {
				messageGroups[handler.groups[idx]] = groupResult;
			});
			handler.fn(rawClientOpts, messageGroups);
		}
	});
};
	
module.exports = {
	message: function(pattern, cb){
		return attachHandler('message', pattern, cb);
	},
	pm: function(pattern, cb){
		return attachHandler('pm', pattern, cb);
	},
	execute: process
};

/*
handle.message(':message', function(opts) {
	console.log('message recieved! - ' + opts.message);
});
handle.message(':message', function(opts) {
	console.log('message recieved again! - ' + opts.message);
});

handle.pm(':message', function(opts) {
	console.log('pm recieved with ' + opts.message);
});

handle.message('!log', function() {
	console.log('!log triggered');
});

handle.message('!jira :message', function(opts) {
	console.log('!jira triggered with ' + opts.message);
});

handle.message('!log :action :message', function(opts) {
	console.log('!log triggered with ' + opts.message);
});

handle.message('!jira :action :issue_number', function(opts) {
	console.log('jira ' + opts.action + ' for issue ' + opts.issue_number);
	console.log(opts);
});

handle.execute('message', "!jira info CS-35");


=======================
=== Raw Client Opts ===
=======================
bot     : this,
from    : from,
to      : to,
text    : text,
message : message

=======================
===     Message     ===
=======================
{ 
  prefix: 'ryanhirsch!~textual@XXX5914.htc.net',
  nick: 'ryanhirsch',
  user: '~textual',
  host: 'XXX5914.htc.net',
  command: 'PRIVMSG',
  rawCommand: 'PRIVMSG',
  commandType: 'normal',
  args: [ '#cti-dev', '!issue PIB-1 asdf' ]
}
*/