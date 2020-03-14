const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, err => {
    if (err) console.error(err);
    db.run(`
        CREATE TABLE IF NOT EXISTS "devices" (
            "id"	    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "ip"        TEXT NOT NULL,
            "static-ip" INTEGER NOT NULL,
            "type"	    TEXT NOT NULL,
            "name"      TEXT NOT NULL
    );`, err => {
        if (err) console.error(err);
    });
});

    /**
     * id - auto
     * ip - ipadress
     * static-ip - integer--boolean
     * type - Sensor|Actuator
     * name - (Lampe)
     */

function deleteDatabase() {
    db.run(`DROP TABLE "devices"`, err => { if(err) console.error(err); });
    //db.run(`DROP TABLE "other"`, err => { if(err) console.error(err); });
    //db.run(`DROP TABLE "other"`, err => { if(err) console.error(err); });
    process.exit(0);
}

// function getGuildSettings(qid, defaultGs, guildName, callback) {
//     db.get(`
//         SELECT *
//         FROM "data"
//         WHERE id = ?;
//     `, [qid], function (err, gs) {
//         if(err) console.error(err);
//         if(gs) callback(gs);
//         else {
//             db.run(`
//                 INSERT INTO "data"
//                 VALUES (?, ?, ?, ?, ?, ?, ?);
//             `, [qid, defaultGs.prefix, guildName, defaultGs.lang, defaultGs.categoryName, defaultGs.talkNameRules, defaultGs.password], function (err) {
//                 if(err) console.error(err);
//                 callback(defaultGs);
//             });
//         }
//     });
// }

module.exports = {

};