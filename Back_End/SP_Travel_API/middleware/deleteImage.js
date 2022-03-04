// Delete an image from the file system

const images = require("../model/images.js");
const path = require("path");
const fs = require("fs-extra");

var deleteImage = (req, res, next) => {
    var imageInfo = req.params;
    images.getImageInfo(imageInfo, (err, result) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData = {
                "error_code": res.statusCode,
                "error_description": errorDescription
            }
            res.send(JSON.stringify(resData));
        } else {
            var delete_full_path = path.join(__dirname, "../../Images", `travel_id_${result[0].fk_travel_id}`, result[0].image_path);
            fs.unlink(delete_full_path, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            next();
        }
    });
};

module.exports = deleteImage;