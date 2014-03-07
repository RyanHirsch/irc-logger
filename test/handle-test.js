process.env.NODE_ENV = 'test';

var sinon       = require('sinon'),
    chai        = require('chai'),
    expect      = chai.expect,
    handle      = require('../handle.js'),
    Q           = require('q');

describe('Handle', function() {
    describe('generic message handler', function() {
        var testFn, clientOpts;
        before(function() {
            testFn = sinon.spy();
            clientOpts = {'a':1};

            handle.message(':message', testFn);
            handle.execute('message', 'lorem ipsum', clientOpts);
        });

        it('should have called the function', function() {
            expect(testFn.called).to.equal(true);
        });

        it('should have used the correct parameters', function() {
            expect(testFn.calledWith(clientOpts, {'message':'lorem ipsum'})).to.equal(true);
        });
    });

    describe('!trigger message handler', function() {
        var testFn, otherFn, clientOpts;
        before(function() {
            testFn = sinon.spy();
            otherFn = sinon.spy();
            clientOpts = {};

            handle.message('!something :nothing', testFn);
            handle.message('!log :nothing', testFn);
            handle.execute('message', '!log do something cool', clientOpts);
        });

        it('should have called the attached !trigger', function() {
            expect(testFn.called).to.equal(true);
        });

        it('should have used the correct parameters', function() {
            expect(testFn.calledWith(clientOpts, {'nothing':'do something cool'})).to.equal(true);
        });

        it('should not have used the wrong parameters', function() {
            expect(testFn.calledWith(undefined, {'nothing':'do something cool'})).to.equal(false);
            expect(testFn.calledWith(clientOpts, undefined)).to.equal(false);
            expect(testFn.calledWith(undefined, undefined)).to.equal(false);
        });

        it('should not have called otherFn', function() {
            expect(otherFn.called).to.equal(false);
        });
    });
});