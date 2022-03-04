const db = require("./databaseConfig.js");

var itinerariesDB = {
    // Get all itineraries of a travel listing
    getItineraries: (itineraryInfo, callback) => {
        var fk_travel_id = itineraryInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT * 
                    FROM itineraries 
                    WHERE fk_travel_id = ?
                    ORDER BY day ASC;`;
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

    // Add an itinerary for a travel listing
    addItinerary: (itineraryInfo, callback) => {
        var fk_travel_id = itineraryInfo.fk_travel_id;
        var day = itineraryInfo.day;
        var activity = itineraryInfo.activity;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO itineraries(fk_travel_id, day, activity) 
                    VALUES (?, ?, ?);`;
                conn.query(sql, [fk_travel_id, day, activity], (err, result) => {
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

module.exports = itinerariesDB;