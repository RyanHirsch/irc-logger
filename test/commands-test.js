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

    describe('processing', function() {
        describe('message "!log t"', function() {
            var allMessage;
            before(function () {
                loaded_commands.message.t_action = sinon.spy();
                loaded_commands.message.s_action = sinon.spy();

                allMessage_one = sinon.spy();
                loaded_commands.all.message.push(allMessage_one)

                allMessage_two = sinon.spy();
                loaded_commands.all.message.push(allMessage_two);

                commands.process('message', undefined, undefined, undefined, '!log t_action')
            });

            it('should call t_action', function() {
                expect(loaded_commands.message.t_action.called).to.equal(true);
            });
            it('should not call s_action', function() {
                expect(loaded_commands.message.s_action.called).to.equal(false);
            });
            it('should call all', function() {
                expect(allMessage_one.called).to.equal(true);
                expect(allMessage_two.called).to.equal(true);
            });
        });
    });
});
