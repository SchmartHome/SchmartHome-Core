export default new class CONFIG {
    deviceApiPort: number;
    serverVersion: number;

    constructor() {
        this.deviceApiPort = 8080;
        this.serverVersion = 0;
    }
}