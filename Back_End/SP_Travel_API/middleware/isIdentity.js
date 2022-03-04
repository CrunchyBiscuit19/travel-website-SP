var check = (req, res, next) => {
    var userId = req.params.user_id || req.params.fk_user_id;
    if (userId !== req.decodedToken.user_id.toString()) {
        res.status(403).send(JSON.stringify({
            "error_code": res.statusCode,
            "error_description": "Forbidden. False identity."
        }));
        return;
    }
    next();
};

module.exports = check;