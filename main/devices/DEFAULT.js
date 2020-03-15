

module.exports = {
    REASON: {
        CLOSE_REQUESED: "sys_close_requested"
    },
    EVENTNAME: {
        SEND: {
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