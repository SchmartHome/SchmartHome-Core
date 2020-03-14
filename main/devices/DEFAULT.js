/**
 *      Server          Client
 *     ------------------------
 *          <-- new  Connection
 *          --> SEND.GET_DEVICE_INFO
 *          <-- RECEIVE.DEVICE_INFO
 * 
 *          --> SEND.REJECT_CONNECTION
 *          --> SEND.ACCEPT_CONNECTION
 *          
 *          
 */

module.exports = {
    EVENTNAME: {
        SEND: {
            GET_DEVICE_INFO: "get_device_info",
            REJECT_CONNECTION: "reject_conn",
            ACCEPT_CONNECTION: "accept_conn"

        },
        RECEIVE: {
            DEVICE_INFO: "device_info",
            CLOSE_CONNECTION: "close_conn"
        }
    }
}