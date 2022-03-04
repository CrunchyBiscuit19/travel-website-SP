// Checks if percentage is below 0, so the discounted price isn't higher than the original price.
// Checks if percetage is above 100, so the discounted price isn't a negative value.

var checkDiscount = (req, res, next) => {
    var discount_percentage = req.body.discount_percentage;
    if (discount_percentage < 0 || discount_percentage > 100) {
        res.statusCode = 400;
        var errorDescription = "";
        if (discount_percentage < 0) {
            errorDescription = "The discount percentage is less than 0%."
        } else {
            errorDescription = "The discount percentage is more than 100%."
        }
        resData = {
            "error_code": res.statusCode,
            "error_description": errorDescription
        }
        res.send(JSON.stringify(resData));
    } else {
        next();
    }
};

module.exports = checkDiscount;