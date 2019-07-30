import {RevocablePromise} from "./index";
import { assert } from 'chai';
import { expect } from 'chai';
import { should } from 'chai';
should();

describe('Working cases:', function() {
    it('should work without error: init single promise', function(done) {
        const q = new RevocablePromise(new Promise(() => done()));
    });
    it('should work without error: init array of 1 promise', function(done) {
        const q = new RevocablePromise([new Promise(() => done())]);
    });
    it('should work without error: init array of promises', function(done) {
        const q = new RevocablePromise([
            new Promise(() => done()),
            new Promise(() => {}),
        ]);
    });
    it('should return the correct response:', function(done) {
        const q = new RevocablePromise(new Promise((res, rej) => res(42)));
        q.then((data) => {
            assert.equal(data, 42);
            done();
        }).catch((err) => {
            done();
            assert.throws(() => {}, "catch func should not be call");
        })
    });
    it('should return the correct error', function(done) {
        const q = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => rej(42), 5)));
        q.then((data) => {
            assert.throws(() => {}, "then func should not be call");
            done();
        }).catch((err) => {
            assert.equal(err, 42);
            done();
        })
    });
    it('should return the correct responses', function(done) {
        const q = new RevocablePromise([new Promise((res, rej) => res(24)),
            new Promise((res, rej) => res(42))]);
        q.then((data) => {
            assert.equal(data.toString(), [24, 42].toString());
            done();
        }).catch((err) => {
            done();
            assert.throws(() => {}, "catch func should not be call");
        })
    });
    it('should return the correct errors', function(done) {
        const q = new RevocablePromise([new Promise((res, rej) =>
                setTimeout(() => rej(24), 5)),
            new Promise((res, rej) => setTimeout(() => rej(42), 10))]);
        q.then((data) => {
            done();
            assert.throws(() => {}, "catch func should not be call");
        }).catch((err) => {
            assert.equal(err, 24);
            done();
        })
    });
    it('should return the correct response', function(done) {
        const q = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(42), 10)));
        q.minTimeout = 5;
        q.then((data) => {
            assert.equal(data, 42);
            done();
        }).catch((err) => {
            done();
            assert.throws(() => {}, "catch func should not be call");
        })
    });
});

describe("Test revoked:", () => {
    it('should revoke the promise', function(done) {
        const q1 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));
        const q2 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => rej(), 5)));
        q1.revoke();
        q2.revoke();
        q1.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        q2.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        setTimeout(() => done(), 10);
    });
    it('should revoke the promise', function(done) {
        const q1 = new RevocablePromise([
            new Promise((res, rej) => setTimeout(() => res(), 5)),
            new Promise((res, rej) => setTimeout(() => res(), 5))]);
        const q2 = new RevocablePromise([
            new Promise((res, rej) => setTimeout(() => rej(), 5)),
            new Promise((res, rej) => setTimeout(() => rej(), 5))]);
        q1.revoke();
        q2.revoke();
        q1.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        q2.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        setTimeout(() => done(), 10);
    });
    it('should revoke the promise', function(done) {
        const q1 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));
        const q2 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => rej(), 5)));
        q1.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        q2.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        q1.revoke();
        q2.revoke();
        setTimeout(() => done(), 10);
    });
    it('should revoke the promise', function(done) {
        const q1 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));
        const q2 = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => rej(), 5)));
        q1.minTimeout = 20;
        q2.minTimeout = 20;
        q1.revoke();
        q2.revoke();
        q1.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        q2.then(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        }).catch(() => {
            done();
            assert.throws(() => {}, "promise not revoked");
        });
        setTimeout(() => done(), 10);
    });
});

describe("Test min timeout:", () => {
    it('should wait before callback', function(done) {
        const q = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));
        const t = Date.now();

        q.minTimeout = 20;
        q.then(() => {
            if (Date.now() - t >= 20) {
                done();
            } else {
                assert.throws(() => {},
                    "minTimeout: " + (Date.now() - t) + " should be minimum 20 ms");
            }
        });
    });
});

describe("Test callback functions:", () => {
    it('should throw: func null', function(done) {
        const q = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));

        // @ts-ignore
        expect(() => q.then()).to.throw();
        done();
    });
    it('should throw: not func', function (done) {
        const q = new RevocablePromise(new Promise((res, rej) =>
            setTimeout(() => res(), 5)));

        // @ts-ignore
        expect(() => q.then(11)).to.throw();
        // @ts-ignore
        expect(() => q.then("11")).to.throw();
        // @ts-ignore
        expect(() => q.then({})).to.throw();
        // @ts-ignore
        expect(() => q.then([])).to.throw();
        done();
    });
});
