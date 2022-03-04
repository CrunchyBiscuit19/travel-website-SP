const db = require("./databaseConfig.js");

var travelsDB = {
    // Get a travel listing
    getTravel: (travelInfo, callback) => {
        var travel_id = travelInfo.travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT * 
                    FROM travels
                    WHERE travel_id = ?;`;
                conn.query(sql, [travel_id], (err, result) => {
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

    // Get last travel listing
    getTravelLast: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT * 
                    FROM travels
                    ORDER BY travel_id DESC
                    LIMIT 1;`;
                conn.query(sql, (err, result) => {
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

    // Get all travel listings from search
    getTravelsSearch: (travelInfo, callback) => {
        var country = travelInfo.country;
        var price = travelInfo.price;
        var travel_period = travelInfo.travel_period;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var priceFilter = "'1' = '1'";
                var fillValues = [country, travel_period];
                if (price !== "NaN") {
                    priceFilter = "price <= ?";
                    fillValues.push(price);
                }
                var sql = 
                    `SELECT * 
                    FROM travels
                    WHERE country = ? AND travel_period = ? AND ${priceFilter};`;
                conn.query(sql, fillValues, (err, result) => {
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

    // Get all travel listings
    getTravels: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT * 
                    FROM travels;`;
                conn.query(sql, (err, result) => {
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

    // Add a travel lisitng
    addTravel: (travelInfo, callback) => {
        var title = travelInfo.title;
        var description = travelInfo.description;
        var price = parseFloat(parseFloat(travelInfo.price).toFixed(2));
        var country = travelInfo.country;
        var travel_period = travelInfo.travel_period;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO travels(title, description, price, country, travel_period) 
                    VALUES (?, ?, ?, ?, ?);`;
                conn.query(sql, [title, description, price, country, travel_period], (err, result) => {
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

    // Delete a travel listing
    delTravel: (travelInfo, callback) => {
        var travel_id = travelInfo.travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `DELETE FROM travels 
                    WHERE travel_id = ?;`;
                conn.query(sql, [travel_id], (err, result) => {
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
    
    // Updates a travel listing
    updateTravel: (travelInfo, callback) => {
        var travel_id = travelInfo.travel_id;
        var title = travelInfo.title;
        var description = travelInfo.description;
        var price = parseFloat(parseFloat(travelInfo.price).toFixed(2));
        var country = travelInfo.country;
        var travel_period = travelInfo.travel_period;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `UPDATE travels 
                    SET title = ?, description = ?, price = ?, country = ?, travel_period = ? 
                    WHERE travel_id = ?;`;
                conn.query(sql, [title, description, price, country, travel_period, travel_id], (err, result) => {
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

module.exports = travelsDB;