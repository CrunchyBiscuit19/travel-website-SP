// Checks if image path is outside of designated "Images" folder

const path = require("path");

var checkPath = (req, res, next) => {
    var travel_id = req.params.fk_travel_id;
    if (travel_id === undefined) {
        travel_id = req.body.fk_travel_id;
    }
    var image_path = req.body.image_path;  
    var errorDescription = "Internal Server Error"; 
    if (image_path === undefined) {
        res.statusCode = 500;
    } else {
        var images_folder = path.join(__dirname, "../../Images", `travel_id_${travel_id}`);
        var image_full_path = path.join(images_folder, image_path);
        if (!image_full_path.includes(images_folder)) {
            res.statusCode = 400;
            errorDescription = `The image path, ${image_path}, is invalid.`
        }
    }
    req.body.image_full_path = image_full_path;
    if (res.statusCode === 200) {
        next();
    } else {
        resData = {
            "error_code": res.statusCode,
            "error_description": errorDescription
        };
        res.send(JSON.stringify(resData));
    }
};

module.exports = checkPath;