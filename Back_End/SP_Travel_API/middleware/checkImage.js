// Checks if image type is not JPG
// Checks if image size is more than or equal to 1MB (which I will take as 1,048,576 Bytes, not 1,000,000 Bytes)

const imageType = require("image-type");
const fs = require("fs-extra");

var checkImage = (req, res, next) => {
    var image_file = req.files[0];
    var errorDescription = "Internal Server Error";
    if (image_file === undefined) {
        res.statusCode = 500;
    } else {
        var image_type = imageType(image_file.buffer).ext;
        var image_size = image_file.size;
        if (image_type !== "jpg" || image_size >= 1048576) {
            if (image_type !== "jpg") {
                res.statusCode = 415;
                errorDescription = "The image type is not JPG."
            } else {
                res.statusCode = 413;
                errorDescription = "The image size is more than or equal to 1MB (1,048,576 Bytes)."
            }
        }
    }
    if (res.statusCode === 200) {
        next();
    } else {
        resData = {
            "error_code": res.statusCode,
            "error_description": errorDescription
        }
        res.send(JSON.stringify(resData));
    }
};

module.exports = checkImage;