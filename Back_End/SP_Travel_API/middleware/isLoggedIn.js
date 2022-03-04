const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../controller/secretKey.js");

var check = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (
        authHeader === null ||
        authHeader === undefined ||
        !authHeader.startsWith("Bearer ")
    ) {
        console.log(authHeader);
        res.status(401).send(JSON.stringify({
            "error_code": res.statusCode,
            "error_description": "Unauthorized client error. Token not found."
        }));
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, {algorithms: ["HS256"]}, (err, decodedToken) => {
        if (err) {
            res.status(401).send(JSON.stringify({
                "error_code": res.statusCode,
                "error_description": "Unauthorized client error. Invalid token."
            }));
            return;
        }
        req.decodedToken = decodedToken;
        next();
    });
};

module.exports = check;
