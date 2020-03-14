const events = require("events");
const deviceAPI = require("./deviceAPI");

module.exports = class Core extends events.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.deviceAPI = deviceAPI;
    }
}
