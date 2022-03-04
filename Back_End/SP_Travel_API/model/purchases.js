const db = require("./databaseConfig.js");

var purchasesDB = {
    // Adds to user's purchases
    addPurchase: (purchaseInfo, callback) => {
        var fk_user_id = purchaseInfo.fk_user_id;
        var fk_travel_id = purchaseInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO purchases(fk_user_id, fk_travel_id) 
                    VALUES (?, ?);`;
                conn.query(sql, [fk_user_id, fk_travel_id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

module.exports = purchasesDB;
