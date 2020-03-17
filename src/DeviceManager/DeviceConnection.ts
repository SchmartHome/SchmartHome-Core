import STATIC from "./STATIC";
import DeviceManager from "./DeviceManager";
import Device from "./Device";
import events from "events";
import WebSocket from "ws";

/**
 * Contains and manages the web socket connection to the actual device.
 */
export default class DeviceConnection extends events.EventEmitter {
    deviceManager: DeviceManager;

    ws: WebSocket;
    deviceData: any;
    closed: boolean;
    device: Device;

    constructor(ws: WebSocket, deviceManager: DeviceManager) {
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
                message = JSON.parse(messageRaw.toString());
            } catch(err) {
                this.ws.send(JSON.stringify({
                    event: STATIC.EVENTNAME.SEND.JSON_ERROR, 
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
            event: STATIC.EVENTNAME.SEND.GET_DEVICE_INFO, 
            data: null
        }));

        this.on(STATIC.EVENTNAME.RECEIVE.DEVICE_INFO, data => {
            let errLocation = this.verifyDeviceData(data);
            if(errLocation) {
                this.ws.send(JSON.stringify({
                    event: STATIC.EVENTNAME.SEND.REJECT_CONNECTION, 
                    data: {
                        reason: STATIC.REASON.CLIENT_DATA_SYNTAX,
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
                    event: STATIC.EVENTNAME.SEND.ACCEPT_CONNECTION, 
                    data: null
                }));
                this.deviceManager.emit("new_device", device);
            }
            else {
                device.bindConnection(this);
                this.ws.send(JSON.stringify({
                    event: STATIC.EVENTNAME.SEND.ACCEPT_CONNECTION, 
                    data: null
                }));
                this.deviceManager.emit("reconnect_device", device);
            }
        })
    }
    
    /**
     * Used internally to validate device data on connection initialisation.
     * @param data Device data (parsed from json)
     */
    verifyDeviceData(data: any): string {
        // device_info_version
        if(typeof data.device_info_version != "number") return "device_info_version: number";
        if(data.device_info_version != STATIC.DEVICE_INFO_VERSION) return "device_info_version == " + STATIC.DEVICE_INFO_VERSION;
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
        return null;
    }

    /**
     * Send a event to the connected Device.
     * @param event The event to send.
     * @param data The data to send
     */
    send(event: string, data: any): void {
        this.ws.send(JSON.stringify({event, data}));
    }
}