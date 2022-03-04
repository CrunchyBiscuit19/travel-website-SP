const db = require("./databaseConfig.js");

var cartsDB = {
    // Gets cart of a user
    getCart: (cartInfo, callback) => {
        var fk_user_id = cartInfo.fk_user_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {              
                var sql = 
                    `SELECT * 
                    FROM carts
                    WHERE fk_user_id = ?;`;
                conn.query(sql, [fk_user_id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
    // Adds to user's cart
    addCart: (cartInfo, callback) => {
        var fk_user_id = cartInfo.fk_user_id;
        var fk_travel_id = cartInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO carts(fk_user_id, fk_travel_id) 
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
    },
    // Deletes a user's cart
    delCart: (cartInfo, callback) => {
        var fk_user_id = cartInfo.fk_user_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {              
                var sql = 
                    `DELETE FROM carts
                    WHERE fk_user_id = ?;`;
                conn.query(sql, [fk_user_id], (err, result) => {
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

module.exports = cartsDB;
