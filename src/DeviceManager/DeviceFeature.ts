import Device from "./Device";

export default class DeviceFeature {
    device: Device
    name: string
    additional: any
    setEvent: {
        eventName: string
        args: [{
            name: string
            type: string
            options: [
                string
            ]}
        ]
    }
    getEvent: {
        eventName: string,
        args: [{
            name: string
            type: string
            options: [
                string
            ]}
        ]
    }

    constructor(featureData: any, device: Device) {
        this.device = device;
        this.name = featureData.name;
        this.additional = featureData.additional;
        this.setEvent = featureData.setEvent;
    }
}