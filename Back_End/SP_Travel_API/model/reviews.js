const db = require("./databaseConfig.js");

var reviewsDB = {
    // Add a review of a travel listing
    addReview: (reviewInfo, callback) => {
        var fk_user_id = reviewInfo.fk_user_id;
        var fk_travel_id = reviewInfo.fk_travel_id;
        var content = reviewInfo.content;
        var rating = parseFloat(parseFloat(reviewInfo.rating).toFixed(2));
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO reviews(fk_user_id, fk_travel_id, content, rating) 
                    VALUES (?, ?, ?, ?);`;
                conn.query(sql, [fk_user_id, fk_travel_id, content, rating], (err, result) => {
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

    // Get all reviews of a travel listings
    getReviews: (reviewInfo, callback) => {
        var fk_travel_id = reviewInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT reviews.*, users.username, users.user_id, travels.title
                    FROM reviews
                    INNER JOIN users ON users.user_id = reviews.fk_user_id 
                    INNER JOIN travels ON (reviews.fk_travel_id = ? AND travels.travel_id = reviews.fk_travel_id);`;
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

module.exports = reviewsDB;