const db = require("./databaseConfig.js");

const Sequelize = require("sequelize");

var imagesDB = {
    // Get showcase image of travel listing
    getImageShowcase: (imageInfo, callback) => {
        var travel_id = imageInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql =
                    `SELECT *
                    FROM images
                    WHERE (fk_travel_id = ? AND image_path = 'showcase.jpg');`;
                conn.query(sql, [travel_id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        console.log(`\n\n\n\n${result}\n\n\n\n`)
                        return callback(null, result);
                    }
                });
            }
        })
    },

    // Get information of an image
    getImageInfo: (imageInfo, callback) => {
        var image_id = imageInfo.image_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql =
                    `SELECT *
                    FROM images
                    WHERE image_id = ?;`;
                conn.query(sql, [image_id], (err, result) => {
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

    // Get a travel listing, and information of its associated images
    getImagesInfo: (imageInfo, callback) => {
        var fk_travel_id = imageInfo.fk_travel_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT *
                    FROM images
                    WHERE fk_travel_id = ?;`;
                conn.query(sql, [fk_travel_id], (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    // Update an image
    updateImage: (imageInfo, callback) => {
        var image_id = imageInfo.image_id;
        var fk_travel_id = imageInfo.fk_travel_id;
        var image_path = imageInfo.image_path;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `UPDATE images
                    SET fk_travel_id = ?, image_path = ?
                    WHERE image_id = ?;`;
                conn.query(sql, [fk_travel_id, image_path, image_id], (err, result) => {
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

    // Add an image
    addImage: (imageInfo, callback) => {
        var fk_travel_id = imageInfo.fk_travel_id;
        var image_path = imageInfo.image_path;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO images(fk_travel_id, image_path)
                    VALUES (?, ?);`;
                conn.query(sql, [fk_travel_id, image_path], (err, result) => {
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
};

module.exports = imagesDB;