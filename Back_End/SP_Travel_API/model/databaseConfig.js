const mysql = require("mysql");
const fs = require("fs");
process.chdir(__dirname)

// Read credentials and use as object
var information = JSON.parse(fs.readFileSync("../../Others/information.json"));

var dbconnect = {
    // Function to connect to MySQL database used in the model files
    getConnection: () => {
        var conn = mysql.createConnection(information);
        return conn;
    },
};

module.exports = dbconnect;