export default new class STATIC {
    DEVICE_INFO_VERSION: number;
    REASON: {
        CLIENT_DATA_SYNTAX: string, 
        CLOSE_REQUESED: string
    };
    EVENTNAME: {
        SEND: {
            JSON_ERROR: string,
            GET_DEVICE_INFO: string,
            REJECT_CONNECTION: string,
            ACCEPT_CONNECTION: string,
            CLOSE_CONNECTION: string,
            UPDATE_DEVICE_INFO: string
        },
        RECEIVE: {
            DEVICE_INFO: string,
            CLOSE_CONNECTION: string,
            ACCEPT_DEVICE_INFO: string,
            REJECT_DEVICE_INFO: string
        }
    };

    constructor() {
        this.DEVICE_INFO_VERSION = 0;
        this.REASON = {
            CLIENT_DATA_SYNTAX: "sys_client_data_syntax",
            CLOSE_REQUESED: "sys_close_requested"
        };
        this.EVENTNAME = {
            SEND: {
                JSON_ERROR: "sys_json_error",
                GET_DEVICE_INFO: "sys_get_device_info",
                REJECT_CONNECTION: "sys_reject_conn",
                ACCEPT_CONNECTION: "sys_accept_conn",
                CLOSE_CONNECTION: "sys_close_conn",
                UPDATE_DEVICE_INFO: "sys_update_d_info"
            },
            RECEIVE: {
                DEVICE_INFO: "sys_d_info",
                CLOSE_CONNECTION: "sys_close_conn",
                ACCEPT_DEVICE_INFO: "sys_accept_d_info",
                REJECT_DEVICE_INFO: "sys_reject_d_info"
            }
        }

    }
}