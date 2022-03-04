// Adds discounted price to response body of promotion GET requests

const travels = require("../model/travels.js");

var addDiscountedPrice = (req, res) => {
    var resData = res.resData;
    var travelInfo = {"travel_id": resData.travel_id};
    travels.getTravel(travelInfo, (err, result) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            resData.discounted_price = parseFloat(((result[0].price * (100 - resData.discount_percentage)) / 100).toFixed(2));
        }
        res.send(JSON.stringify(resData));
    });
}

module.exports = addDiscountedPrice;