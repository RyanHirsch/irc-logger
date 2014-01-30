var message_first = function () { console.log('message_first'); };
var message_second = function () { console.log('message_second'); };
var pm_first = function () { console.log('PM 1'); };
var pm_second = function () { console.log('PM 2'); };

module.exports = {
  message: [ message_first, message_second ],
  pm: [ pm_first, pm_second ]
};