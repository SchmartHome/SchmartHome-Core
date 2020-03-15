// Imports
const DEFAULT = require("./DEFAULT");
const events = require("events");
const WebSocket = require("ws");

/**
 *                   /-------------------------\
 *                   |  Server   <-->   Client |
 *                   |         Overview        |
 *                   \-------------------------/
 *  
 *  
 *          Connect (origin client):
 *       --------------------------------------------------------
 * 
 *          <-- new Connection() 
 *          --> SEND.GET_DEVICE_INFO (args: null)
 *          <-- RECEIVE.DEVICE_INFO (args: Object DeviceInfo)
 *         
 *          --> SEND.REJECT_CONNECTION (args: String Reason)
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
  
  {
    "name": "Lampe",
    "features": [
      {
        "type": "Actuator"
        "name": "Lampe an.",
        "eventname": "LampOn",
        "args": []
      },
      {
        "type": "get"
        "name": "Get State",
        "eventname": "getLampState",
        "args": []
      }
    ]
  }
   */

class DeviceManager {
    /**
     * Handels devices.
     */
    constructor() {
        this.deviceConnections = [];
        this.wss = new WebSocket.Server({ port: 8080 });

        wss.on("connection", function connection(ws) {
            let deviceConnection = new DeviceConnection(ws, null);
            this.deviceConnections.push(deviceConnection);

            // TODO Handle default events.
        });

        setInterval(() => {
            for (const i in this.deviceConnections) {
                if(this.deviceConnections[i].closed) this.deviceConnections.splice(i);
            }
        }, 1000);
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
     * @param {WebSocket} ws 
     * @param {any} data 
     */
    constructor(ws, deviceData) {
        super();

        this.ws = ws;
        this.deviceData = deviceData;
        this.closed = false;

        this.ws.on("close", () => {
            this.closed = true;
        });

        this.ws.on("message", () => {
            var message = null;
            try {
                message = JSON.parse(messageRaw);
            } catch(err) {
                return;
            } finally {
                if(typeof message.event == "undefined") return;
                if(typeof message.data == "undefined") return;
                super.emit(message.event, message.data);
            }
        });

        this.init();
    }

    /**
     * Initialise Connection.
     * Is done automatically.
     */
    init() {
        this.ws.send(JSON.stringify({
            event: DEFAULT.EVENTNAME.SEND.GET_DEVICE_INFO, 
            data: null
        }));
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

module.exports = {
    // Classes
    DeviceManager,
    DeviceConnection
};