import DeviceManager from "./DeviceManager";
import DeviceConnection from "./DeviceConnection";
import DeviceFeature from "./DeviceFeature";
import events from "events";

/**
 * Represents a Device connected to the system.
 */
export default class Device extends events.EventEmitter {
    deviceManager: DeviceManager

    name: string
    udid: string
    features: DeviceFeature[]
    online: boolean
    deviceConnection: DeviceConnection

    constructor(deviceConnection, deviceManager) {
        super();
        this.deviceManager = deviceManager;

        this.name = deviceConnection.deviceData.name;
        this.udid = deviceConnection.deviceData.udid;
        this.features = deviceConnection.deviceData.features;
        this.online = true;
        this.deviceConnection = deviceConnection;
    }

    /**
     * Update data recieved by deviceConnection.
     */
    updateConnection(): void {
        this.online = !this.deviceConnection.closed;
        this.name = this.deviceConnection.deviceData.name;
        this.udid = this.deviceConnection.deviceData.udid;
        this.features = this.deviceConnection.deviceData.features;
    }

    /**
     * Bind a device to a new connection.
     * @param deviceConnection A new DeviceConnection to bind to.
     */
    bindConnection(deviceConnection: DeviceConnection): void {
        this.deviceConnection = deviceConnection;
    }
}