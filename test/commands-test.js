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
        it('should update our load timestamp', function(done) {
            console.log(loaded_commands.message.load);
            var firstLoad = getMilliseconds(loaded_commands.message.load);
            commands.rehash('test/test_commands').then(function(cmds) {
                var reloadDuration = getMilliseconds(cmds.message.load) - firstLoad;
                console.log(reloadDuration);
                var nowDuration = now() - getMilliseconds(cmds.message.load);
                console.log(nowDuration);
                expect(duration).to.be.above(1);
                done();
            });
        });
    });
});
