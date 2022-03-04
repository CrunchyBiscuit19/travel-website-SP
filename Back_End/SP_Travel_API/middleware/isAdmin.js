var check = (req, res, next) => {
    const roleHeader = req.decodedToken.role;
    if (
        roleHeader === null ||
        roleHeader === undefined ||
        roleHeader !== "admin"
    ) {
        res.status(403).send(JSON.stringify({
            "error_code": res.statusCode,
            "error_description": "Forbidden. Not Admin."
        }));
        return;
    }
    next();
};

module.exports = check;