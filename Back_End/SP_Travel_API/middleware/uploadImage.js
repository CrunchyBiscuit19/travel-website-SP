// Upload the image to the file system

const fs = require("fs-extra");

var uploadImage = (req, res) => {
    var resData = res.resData;
    var image_content = req.files[0].buffer;
    var image_full_path = req.body.image_full_path;
    fs.outputFile(image_full_path, image_content, (err) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData = {
                "error_code": res.statusCode,
                "error_description": errorDescription
            }
            res.send(JSON.stringify(resData));
            return null;
        }
    });
    res.send(JSON.stringify(resData));
};

module.exports = uploadImage;