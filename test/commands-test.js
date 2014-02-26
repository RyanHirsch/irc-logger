process.env.NODE_ENV = 'test';

var sinon       = require('sinon'),
    chai        = require('chai'),
    expect      = chai.expect,
    commands    = require('../commands.js'),
    Q           = require('q');

var now = function() {
    return getMilliseconds(new Date());
};

var getSeconds = function(date) {
    return Math.floor((date.getTime())/1000);
};

var getMilliseconds = function(date) {
    return date.getTime();
}

describe('Commands', function() {
    var loaded_commands = {};
    before(function (done) {
        commands.rehash('test/test_commands').then(function(cmds) {
            loaded_commands = cmds;
            done();
        });  
    });

    describe('static', function() {
        it('should have loaded message', function() {
            expect(loaded_commands.message.static).to.equal('message static');
        });

        it('should have loaded pm', function() {
            expect(loaded_commands.pm.static).to.equal('pm static');
        });
    });

    describe('func', function() {
        it('should have loaded message', function() {
            expect(loaded_commands.message.func()).to.equal('message function');
        });

        it('should have loaded pm', function() {
            expect(loaded_commands.pm.func()).to.equal('pm function');
        });
    });

    describe('rehash', function() {
        it('should reload our timestamp function', function(done) {
            var firstLoad = getMilliseconds(loaded_commands.message.load);
            commands.rehash('test/test_commands').then(function(cmds) {
                var reloadDuration = getMilliseconds(cmds.message.load) - firstLoad;
                var nowDuration = now() - getMilliseconds(cmds.message.load);
                expect(reloadDuration).to.be.above(1);
                expect(reloadDuration).to.be.above(nowDuration);
                done();
            });
        });
    });
});
