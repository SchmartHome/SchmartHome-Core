const events = require("events");
const DeviceAPI = require("./deviceAPI");

module.exports = class Core extends events.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
 
        this.deviceAPI = new DeviceAPI();
    }
}
