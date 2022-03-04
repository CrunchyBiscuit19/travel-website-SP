const app = require("./controller/app.js");

var port = 3000;

// Starting the server and listen for requests
var server = app.listen(port, function () {
    console.log(`Web App hosted at http://localhost:${port}`);
});