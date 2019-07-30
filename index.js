"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RevocablePromise {
    constructor(qs) {
        this.revoked = false;
        this.minT = 0;
        this.startAt = Date.now();
        this.revoke = () => {
            this.revoked = true;
        };
        this.then = (resCallBack) => {
            if (typeof resCallBack !== "function") {
                throw new Error("callback should be a function");
            }
            this.resCallBack = resCallBack;
            return (this);
        };
        this.catch = (errCallBack) => {
            if (typeof errCallBack !== "function") {
                throw new Error("callback should be a function");
            }
            this.errCallBack = errCallBack;
            return (this);
        };
        this.rejected = (err) => {
            if (!this.revoked && this.errCallBack) {
                setTimeout(() => {
                    if (typeof this.errCallBack === "function") {
                        this.errCallBack(err);
                    }
                }, this.getMinTimeout());
            }
        };
        this.successful = (data) => {
            if (!this.revoked && this.resCallBack) {
                setTimeout(() => {
                    if (typeof this.resCallBack === "function") {
                        this.resCallBack(data);
                    }
                }, this.getMinTimeout());
            }
        };
        this.getMinTimeout = () => {
            return (this.minT === 0 ? 0 : this.minT - (Date.now() - this.startAt) + 1);
        };
        try {
            setTimeout(() => {
                if (Array.isArray(qs)) {
                    Promise.all(qs)
                        .then(this.successful)
                        .catch(this.rejected);
                }
                else {
                    qs
                        .then(this.successful)
                        .catch(this.rejected);
                }
            }, 0);
        }
        catch (e) {
            this.rejected(e);
        }
    }
    set minTimeout(v) {
        this.minT = v;
    }
}
exports.RevocablePromise = RevocablePromise;
//# sourceMappingURL=index.js.map