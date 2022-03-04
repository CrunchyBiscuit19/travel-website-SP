// Adds discounted price to response body of promotion GET requests

const travels = require("../model/travels.js");

var addDiscountedPrices = (req, res) => {
    var resData = res.resData;
    var resData1 = []
    var travelInfo = {"travel_id": req.params.fk_travel_id};
    travels.getTravel(travelInfo, (err, result) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData1 = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            for (const promotion of resData) {
                promotion.discounted_price = parseFloat(((result[0].price * (100 - promotion.discount_percentage)) / 100).toFixed(2));
                resData1.push(promotion);
            }
        }
        resData = resData1;
        res.send(JSON.stringify(resData));
    });
}

module.exports = addDiscountedPrices;