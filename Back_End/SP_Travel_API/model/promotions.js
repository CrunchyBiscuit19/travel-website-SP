const db = require("./databaseConfig.js");

var promotionsDB = {
    // Get a promotion
    getPromotion: (promotionInfo, callback) => {
        var promotion_id = promotionInfo.promotion_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT promotions.*, travels.travel_id, travels.title
                    FROM promotions
                    INNER JOIN travels ON (promotions.promotion_id = ? AND travels.travel_id = promotions.fk_travel_id);`;
                conn.query(sql, [promotion_id], (err, result) => {
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

    // Get all promotions of a travel listing
    getPromotions: (promotionInfo, callback) => {
        var fk_travel_id = promotionInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT promotions.*, travels.title
                    FROM promotions
                    INNER JOIN travels ON (promotions.fk_travel_id = ? AND travels.travel_id = promotions.fk_travel_id);`;
                conn.query(sql, [fk_travel_id], (err, result) => {
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

    // Update a promotion
    updatePromotion: (promotionInfo, callback) => {
        var fk_travel_id = promotionInfo.fk_travel_id;
        var promotion_start = promotionInfo.promotion_start;
        var promotion_end = promotionInfo.promotion_end;
        var discount_percentage = parseFloat(parseFloat(promotionInfo.discount_percentage).toFixed(2));
        var promotion_id = promotionInfo.promotion_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `UPDATE promotions 
                    SET fk_travel_id = ?, promotion_start = ?, promotion_end = ?, discount_percentage = ?
                    WHERE promotion_id = ?;`;
                conn.query(sql, [fk_travel_id, promotion_start, promotion_end, discount_percentage, promotion_id], (err, result) => {
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

    // Add a promotion to a travel listing
    addPromotion: (promotionInfo, callback) => {
        var fk_travel_id = promotionInfo.fk_travel_id;
        var promotion_start = promotionInfo.promotion_start;
        var promotion_end = promotionInfo.promotion_end;
        var discount_percentage = parseFloat(parseFloat(promotionInfo.discount_percentage).toFixed(2));
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO promotions(fk_travel_id, promotion_start, promotion_end, discount_percentage)
                    VALUES (?, ?, ?, ?);`;
                conn.query(sql, [fk_travel_id, promotion_start, promotion_end, discount_percentage], (err, result) => {
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

    // Delete a promotion
    delPromotion: (promotionInfo, callback) => {
        var promotion_id = promotionInfo.promotion_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `DELETE FROM promotions 
                    WHERE promotion_id = ?;`;
                conn.query(sql, [promotion_id], (err, result) => {
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

    // Delete all promotions of a travel listtng
    delPromotions: (promotionInfo, callback) => {
        var fk_travel_id = promotionInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `DELETE FROM promotions 
                    WHERE fk_travel_id = ?;`;
                conn.query(sql, [fk_travel_id], (err, result) => {
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
};

module.exports = promotionsDB;