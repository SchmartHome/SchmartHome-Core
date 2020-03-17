import DeviceManager from "./DeviceManager";
import DeviceConnection from "./DeviceConnection";

/**
 * Represents a Device connected to the system.
 */
export default class Device {
    deviceManager: DeviceManager;

    name: string;
    udid: string;
    features: any;
    online: boolean;
    deviceConnection: DeviceConnection;

    constructor(deviceConnection, deviceManager) {
        this.deviceManager = deviceManager;

        this.name = deviceConnection.deviceData.name;
        this.udid = deviceConnection.deviceData.udid;
        this.features = deviceConnection.deviceData.features;
        this.online = true;
        this.deviceConnection = deviceConnection;
    }

    /**
     * Bind a device to a new connection.
     * @param deviceConnection A new DeviceConnection to bind to.
     */
    bindConnection(deviceConnection: DeviceConnection): void {
        this.online = !this.deviceConnection.closed;
        this.deviceConnection = deviceConnection;
    }
}