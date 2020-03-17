import Core from "../Core";
import Device from "./Device";
import DeviceConnection from "./DeviceConnection";
import events from "events";
import WebSocket from "ws";

/**
 * Manages all connected devices.
 * Events:
 *  "disconnect_device", device => void;
 *  "new_device", device => void;
 *  "reconnect_device", device => void;
 */
export default class DeviceManager extends events.EventEmitter {
    core: Core;

    wss: WebSocket.Server;
    devices: Device[];
    
    constructor(core: Core) {
        super();
        this.core = core;

        this.wss = new WebSocket.Server({ port: 8080 });
        this.devices = [];
        
        this.wss.on("connection", ws => {
            new DeviceConnection(ws, this);
        });
    }
}


/*
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