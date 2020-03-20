import DeviceManager from "./DeviceManager/DeviceManager";

export default class Core {
    deviceManager: DeviceManager;

    constructor() {
        this.deviceManager = new DeviceManager(this);
    }
}

// const sqlite3 = require("sqlite3").verbose();

// const db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, err => {
//     if (err) console.error(err);
//     db.run(`
//         CREATE TABLE IF NOT EXISTS "devices" (
//             "id"	    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
//             "ip"        TEXT NOT NULL,
//             "static-ip" INTEGER NOT NULL,
//             "type"	    TEXT NOT NULL,
//             "name"      TEXT NOT NULL
//     );`, err => {
//         if (err) console.error(err);
//     });
// });