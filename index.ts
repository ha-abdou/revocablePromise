
export class RevocablePromise {
    private revoked = false;
    private errCallBack?: (err: any) => void;
    private resCallBack?: (data: any) => void;
    private minT = 0;
    private startAt = Date.now();

    public constructor(qs: Promise<any> | Array<Promise<any>> ) {
        try {
            setTimeout(() => {
                if (Array.isArray(qs)) {
                    Promise.all(qs)
                        .then(this.successful)
                        .catch(this.rejected);
                } else {
                    qs
                        .then(this.successful)
                        .catch(this.rejected);
                }
            }, 0);
        } catch (e) {
            this.rejected(e);
        }
    }

    public revoke = () => {
        this.revoked = true;
    };

    public then = (resCallBack: (data: any) => void) => {
        if (typeof resCallBack !== "function") {
            throw new Error("callback should be a function");
        }
        this.resCallBack = resCallBack;
        return (this);
    };

    public catch = (errCallBack: (err: any) => void) => {
        if (typeof errCallBack !== "function") {
            throw new Error("callback should be a function");
        }
        this.errCallBack = errCallBack;
        return (this);
    };

    set minTimeout(v: number) {
        this.minT = v;
    }

    private rejected = (err: any) => {
        if (!this.revoked && this.errCallBack) {
            setTimeout(() => {
                if (typeof this.errCallBack === "function") {
                    this.errCallBack(err);
                }
            }, this.getMinTimeout());
        }
    };

    private successful = (data: any) => {
        if (!this.revoked && this.resCallBack) {
            setTimeout(() => {
                if (typeof this.resCallBack === "function") {
                    this.resCallBack(data);
                }
            }, this.getMinTimeout());
        }
    };

    private getMinTimeout = () => {
        return (this.minT === 0 ? 0 : this.minT - (Date.now() - this.startAt) + 1);
    };
}
