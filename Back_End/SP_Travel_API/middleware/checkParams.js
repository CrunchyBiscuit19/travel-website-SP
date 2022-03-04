// Check if URL params in requests are integers

var checkParams = (req, res, next) => {
    if (Object.keys(req.params).length === 0) { // if statement for when I can get this to run on all requests automatically
        next();
    } else {
        var regexPattern = new RegExp("^\\d+$");
        for (const [paramKey, paramValue] of Object.entries(req.params)) {
            if (!paramValue.match(regexPattern)) {
                res.statusCode = 400;
                var errorDescription = `One of the URL parameter(s) is invalid.`;
                resData = {
                    "error_code": res.statusCode,
                    "error_description": errorDescription
                };
                res.send(JSON.stringify(resData));
                return null;
            } 
        }
        next();
    }
}

module.exports = checkParams;