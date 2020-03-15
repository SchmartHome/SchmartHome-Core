// Imports
const DEFAULT = require("./DEFAULT");
const events = require("events");
const WebSocket = require("ws");

/**
 *                   /-------------------------\
 *                   |  Server   <-->   Device |
 *                   |         Overview        |
 *                   \-------------------------/
 *  
 *  
 *          Connect (origin client):
 *       --------------------------------------------------------
 * 
 *          <-- new Connection() 
 *          --> SEND.GET_DEVICE_INFO (args: Object ServerInfo)
 *          <-- RECEIVE.DEVICE_INFO (args: Object DeviceInfo)
 *         
 *          --> SEND.REJECT_CONNECTION (args: String Reason)
 *          --> connection.close() 
 *              OR
 *          --> SEND.ACCEPT_CONNECTION (args: null)
 *          
 * 
 *          Disconnect (origin client):
 *       --------------------------------------------------------
 *          
 *          <-- RECEIVE.CLOSE_CONNECTION (args: String Reason)
 *          --> SEND.CLOSE_CONNECTION (args: String DEFAULT.REASON.CLOSE_REQUESED)
 *          --> connection.close() 
 * 
 * 
 *          Update device info (origin server)
 *          (if device has storage) 
 *       --------------------------------------------------------
 *          --> SEND.UPDATE_DEVICE_INFO (args: Object DeviceInfo)
 *          
 *          <-- RECEIVE.ACCEPT_DEVICE_INFO (args: null)
 *              OR
 *          <-- RECEIVE.REJECT_DEVICE_INFO (args: String Reason)
 */

// TODO Remove Comment
/*
sampleDeviceInfo: {
    "device_info_version": 0,

    "name": "Lampe",
    "udid": "SDFGHSDGHFGBUSGDBVFUSDF",
    
    "features": [
        {
            "name": "Lamp",
            "setEvent": {
                "eventName": "LampTrigger",
                "args": [
                    {
                        "name": "state",
                        "type": "string",
                        "options": [
                            "on",
                            "off",
                            "switch"
                        ]
                    }
                ]
            }
            "getEvent": {
                "eventName": "LampGet",
                "args": [
                    {
                        "name": "state",
                        
                    }
                ]
            }
        },
        {
            "name": "Brightness",
            "setEvent": {
                "eventName": "LampBrightness",
                "args": [
                    {
                        "name": "state",
                        "type": "number",
                        "options": [
                            {"smaler": 101, larger: -1},
                            -10
                        ]
                    }
                ]
            }
        }
    ]
}
*/

class DeviceManager extends events.EventEmitter {
    /**
     * Handels devices.
     * 
     */
    
    constructor() {
        super();

        this.wss = new WebSocket.Server({ port: 8080 });
        this.wss.clients
        this.devices = [];
        
        // WebSocket Server
        this.wss.on("connection", ws => {
            new DeviceConnection(ws, this);
        });

        this.addListener("new_device", device => {
            console.log("new_device");
        });
        this.addListener("reconnect_device", device => {
            console.log("reconnect_device");
        });
        this.addListener("disconnect_device", device => {
            console.log("disconnect_device");
        });
    }

    
}

/**
 *  addListener(event: 'connection', cb: (client: WebSocket) => void): this;
    addListener(event: 'error', cb: (err: Error) => void): this;
    addListener(event: 'headers', cb: (headers: string[], request: http.IncomingMessage) => void): this;
    addListener(event: 'close' | 'listening', cb: () => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
 */

class Device {
    /**
     * Represents a Device.
     * @param {DeviceConnection} deviceConnection 
     * @param {DeviceManager} deviceManager 
     */
    constructor(deviceConnection, deviceManager) {
        this.name = deviceConnection.deviceData.name;
        this.udid = deviceConnection.deviceData.udid;
        this.features = deviceConnection.deviceData.features;

        this.online = true;

        this.deviceManager = deviceManager;
        this.deviceConnection = deviceConnection;
    }

    /**
     * Bind a new DeviceConnection.
     * @param {DeviceConnection} deviceConnection 
     */
    bindConnection(deviceConnection) {
        this.online = !this.deviceConnection.closed;
        this.deviceConnection = deviceConnection;
    }
}

class DeviceConnection extends events.EventEmitter {
    /**
     * Web Socket connection to client.
     * Send events using 
     *    this.emit(event: String, data: any);
     * Listen for events using 
     *   this.on(event: String, listener: (data: any) => void);
     *   OR
     *   this.on(event: String, listener: (data: any) => void);
     * @param {DeviceManager} deviceManager
     * @param {WebSocket} ws 
     * @param {any} data 
     */
    constructor(ws, deviceManager) {
        super();
        this.deviceManager = deviceManager;

        this.ws = ws;
        this.deviceData = {};
        this.closed = false;
        this.device = null;

        this.ws.on("close", () => {
            this.closed = true;
            if(this.device) this.device.online = false;
            if(this.device) this.deviceManager.emit("disconnect_device", this.device);
        });

        this.ws.on("message", messageRaw => {
            var message = null;
            try {
                message = JSON.parse(messageRaw);
            } catch(err) {
                this.ws.send(JSON.stringify({
                    event: DEFAULT.EVENTNAME.SEND.JSON_ERROR, 
                    data: {
                        message: err.message
                    }
                }));
                return;
            } 
            if(typeof message.event == "undefined") return;
            if(typeof message.data == "undefined") return;
            super.emit(message.event, message.data);
        });

        this.ws.send(JSON.stringify({
            event: DEFAULT.EVENTNAME.SEND.GET_DEVICE_INFO, 
            data: null
        }));

        this.on(DEFAULT.EVENTNAME.RECEIVE.DEVICE_INFO, data => {
            let errLocation = this.verifyDeviceData(data);
            if(errLocation) {
                this.ws.send(JSON.stringify({
                    event: DEFAULT.EVENTNAME.SEND.REJECT_CONNECTION, 
                    data: {
                        reason: DEFAULT.REASON.CLIENT_DATA_SYNTAX,
                        message: "Syntax error in " + errLocation
                    }
                }));
                return;
            }
            this.deviceData = data;
            var device = this.deviceManager.devices.find(d => d.udid == data.udid);
            if(!device) {
                device = new Device(this, this.deviceManager);
                this.device = device;
                this.deviceManager.devices.push(device);
                this.ws.send(JSON.stringify({
                    event: DEFAULT.EVENTNAME.SEND.ACCEPT_CONNECTION, 
                    data: null
                }));
                this.deviceManager.emit("new_device", device);
            }
            else {
                device.bindConnection(this);
                this.ws.send(JSON.stringify({
                    event: DEFAULT.EVENTNAME.SEND.ACCEPT_CONNECTION, 
                    data: null
                }));
                this.deviceManager.emit("reconnect_device", device);
            }
        })
    }

    verifyDeviceData(data) {
        // device_info_version
        if(typeof data.device_info_version != "number") return "device_info_version: number";
        if(data.device_info_version != DEFAULT.DEVICE_INFO_VERSION) return "device_info_version == " + DEVICE_INFO_VERSION;
        
        // name
        if(typeof data.name != "string") return "name: string";

        // udid
        if(typeof data.udid != "string") return "udid: string";
        if(data.udid.length != 16) return "udid.length == 16";

        // features
        if(typeof data.features != "object") return "features: object";
        for (const feature of data.features) {
            // name
            if(typeof feature.name != "string") return "features[].name: string";

            // setEvent
            if(typeof feature.setEvent != "object") return "features[].setEvent: object";

            // setEvent.eventName
            if(typeof feature.setEvent.eventName != "string") return "features[].setEvent.eventName: string";

            // setEvent.args
            if(typeof feature.setEvent.args != "object") return "features[].setEvent.args: object";
            for (const arg of feature.setEvent.args) {
                // name
                if(typeof arg.name != "string") return "features[].setEvent.args[].name: string";

                // type
                if(!(arg.type == "string" || arg.type == "number")) return "features[].setEvent.args[].type == string || number";

                // options
                if(!(typeof arg.options == "undefined" || typeof arg.options == "object")) return "features[].setEvent.args[].options: undefined || object";
            }

            // getEvent
            if(typeof feature.getEvent != "object") return "features[].getEvent: object";

            // getEvent.eventName
            if(typeof feature.getEvent.eventName != "string") return "features[].getEvent.eventName: string";

            // getEvent.args
            if(typeof feature.getEvent.args != "object") return "features[].getEvent.args: object";
            for (const arg of feature.getEvent.args) {
                // name
                if(typeof arg.name != "string") return "features[].getEvent.args[].name: string";

                // type
                if(!(typeof arg.type == "string" || typeof arg.type == "number")) return "features[].getEvent.args[].name: string || number";

                // options
                if(!(typeof arg.options == "undefined" || typeof arg.options == "object")) return "features[].getEvent.args[].name: undefined || object";
            }
        }

        return false;
    }

    /**
     * Add a listener to a WebSocketEvent recieved by Server.
     * @param {String} event 
     * @param {(data: any) => void} listener 
     */
    on(event, listener) {
        super.on(event, listener);
    }

    /**
     * Add a listener to a WebSocketEvent recieved by Server.
     * Auto removes after one call.
     * @param {String} event 
     * @param {(data: any) => void} listener 
     */
    once(event, listener) {
        super.once(event, listener);
    }

    /**
     * Send a WebSocketEvent to Device.
     * @param {String} event 
     * @param {any} data 
     */
    emit(event, data) {
        this.ws.send(JSON.stringify({event, data}));
    }
}

module.exports = DeviceManager;