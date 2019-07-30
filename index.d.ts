export default class RevocablePromise {
    private revoked;
    private errCallBack?;
    private resCallBack?;
    private minT;
    private startAt;
    constructor(qs: Promise<any> | Array<Promise<any>>);
    revoke: () => void;
    then: (resCallBack: (data: any) => void) => this;
    catch: (errCallBack: (err: any) => void) => this;
    minTimeout: number;
    private rejected;
    private successful;
    private getMinTimeout;
}
