const db = require("./databaseConfig.js");

var usersDB = {
    // Verifies a user
    verifyUser: (userInfo, callback) => {
        var username = userInfo.username;
        var password = userInfo.password;
        console.log(username);
        console.log(password);
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err);
            } else {
                var sql = 
                    `SELECT * 
                    FROM users
                    WHERE (username = ? AND password = ?);`;
                conn.query(sql, [username, password], (err, result) => {
                    conn.end()
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);   
                    }     
                });
            }
        });
    },
    
    // Get all users
    getUsers: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `SELECT * 
                    FROM users;`;
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

    // Add a user
    addUser: (userInfo, callback) => {
        var username = userInfo.username;
        var email = userInfo.email;
        var password = userInfo.password;
        var profile_pic_url = userInfo.profile_pic_url;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `INSERT INTO users(username, email, password, profile_pic_url, role) 
                    VALUES (?, ?, ?, ?, ?);`;
                conn.query(sql, [username, email, password, profile_pic_url, role], (err, result) => {
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

    // Get a certain user
    getUser: (userInfo, callback) => {
        var user_id = userInfo.user_id;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {              
                var sql = 
                    `SELECT * 
                    FROM users
                    WHERE user_id = ?;`;
                conn.query(sql, [user_id], (err, result) => {
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

    // Update information about a user
    updateUser: (userInfo, callback) => {
        var user_id = userInfo.user_id;
        var username = userInfo.username;
        var email = userInfo.email;
        var password = userInfo.password;
        var profile_pic_url = userInfo.profile_pic_url;
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = 
                    `UPDATE users 
                    SET username = ?, email = ?, password = ?, profile_pic_url = ?, role = ? 
                    WHERE user_id = ?;`;
                conn.query(sql, [username, email, password, profile_pic_url, role, user_id], (err, result) => {
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

module.exports = usersDB;
