// Assumptions
/*
1. Some endpoints here should return a 404 (resource not found) HTTP response code for a response that finds no
resources and therefore cannot return anything. However, since the assignment brief did not mention it as one of 
the possible error responses, it is not implemented and a 2XX HTTP or 5XX response code is sent in its place instead.

2. There are other possible errors for which another more suitable response code will be sent in their response code's place.

3. Some of the routes, request fields, and response fields, have been modified from the assignment brief to keep 
them consistent between endpoints.

4. For the PUT and POST image endpoints, I take 1MB to be 1,048,576 Bytes, not 1,000,000 Bytes. 
*/ 

// npm run --prefix .\Back_End\SP_Travel_API\ start-dev

// Import the modules here
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sha2 = require("sha2");

// Import the JWT Key here
const JWT_SECRET = require("./secretKey.js");

// Import the model files here
const users = require("../model/users.js");
const travels = require("../model/travels.js");
const itineraries = require("../model/itineraries.js");
const reviews = require("../model/reviews.js");
const promotions = require("../model/promotions.js");
const images = require("../model/images.js");
const carts = require("../model/carts.js");
const purchases = require("../model/purchases.js");

// Import middleware files here
const checkParams = require("../middleware/checkParams.js");
const checkDiscount = require("../middleware/checkDiscount.js");
const checkImage = require("../middleware/checkImage.js");
const checkPath = require("../middleware/checkPath.js");
const deleteImage = require("../middleware/deleteImage.js");
const uploadImage = require("../middleware/uploadImage.js");
const addDiscountedPrice = require("../middleware/addDiscountedPrice.js");
const addDiscountedPrices = require("../middleware/addDiscountedPrices.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isIdentity = require("../middleware/isIdentity.js");
const isAdmin = require("../middleware/isAdmin.js");

// Miscellaneous
process.chdir(__dirname);
var upload = multer();
var app = express();

// Use images, and attach body parser, JSON parser, form-data parser, and CORS middleware
app.use(express.static("../../Images"));
app.use(upload.array("image_file"));
app.use(express.urlencoded({"extended": false}));
app.use(express.json());
app.use(cors());

// Handle users related requests

// Verifies if user is admin or not
app.get("/admin/verify/", isLoggedIn, isAdmin, (req, res) => {
    res.status(204).send();
});

// Verifies a user
app.post("/login/", (req, res) => {
    var userInfo = req.body;
    userInfo.password = sha2.SHA224(userInfo.password).toString("hex");
    users.verifyUser(userInfo, (err, result) => {
        var resData = {};
        console.log(result);
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error."; 
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
            res.send(JSON.stringify(resData));
            return;
        }
        if (result.length === 0) {
            res.statusCode = 401;
            errorDescription = "Unauthorized. Check authorization credentials";
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
            res.send(JSON.stringify(resData));
            return;
        }
        var userData = result[0];
        const payload = {"user_id": userData.user_id, "role": userData.role};
        jwt.sign(payload, JWT_SECRET, (err, token) => {
            if (err) {
                console.log(err);
                res.statusCode = 401;
                errorDescription = "Unauthorized. Check authorization credentials";
                resData = {
                    "error_code": res.statusCode, 
                    "error_description": errorDescription
                };
            } else {
                resData = Object.assign({"token": token}, payload);
            }
            res.send(JSON.stringify(resData));
            return;
        });
    });
});

// Retrieve all users
app.get("/users/", (req, res) => {
    users.getUsers((err, result) => {
        var resData = {};
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
            for (const user of result) {
                delete user.password;
            }
            resData = result;
        }
        res.send(JSON.stringify(resData));
    });
});

// Add a new user
app.post("/users/", (req, res) => {
    var userInfo = req.body;
    userInfo.password = sha2.SHA224(userInfo.password).toString("hex");
    users.addUser(userInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";            
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateEntry = regexMatches[1];
                var duplicateColumn = regexMatches[2].split('.')[1];
                errorDescription = `The new ${duplicateColumn} provided, ${duplicateEntry}, already exists.`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 201;
            resData = {"user_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Retrieve a user
app.get("/users/:user_id/", checkParams, (req, res) => {
    var userInfo = req.params;
    users.getUser(userInfo, (err, result) => {
        var resData = {};
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
            for (const user of result) {
                delete user.user_id;
                delete user.password;
            }
            resData = result[0];
        }
        res.send(JSON.stringify(resData));
    });
});

// Update a user
app.put("/users/:user_id/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var userInfo = Object.assign(req.body, req.params);
    userInfo.password = sha2.SHA224(userInfo.password).toString("hex");
    users.updateUser(userInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateEntry = regexMatches[1];
                var duplicateColumn = regexMatches[2].split('.')[1];
                errorDescription = `The new ${duplicateColumn} provided, ${duplicateEntry}, already exists.`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Handle travels listings related requests

// Retrieve all travel listings
app.get("/travels/", (req, res) => {
    travels.getTravels((err, result) => {
        var resData = {};
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
            resData = result;
        }
        res.send(JSON.stringify(resData));
    });
});

// Retrieve last travel listing
app.get("/travels/last/", (req, res) => {
    travels.getTravelLast((err, result) => {
        var resData = {};
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
            resData = result[0];
        }
        res.send(JSON.stringify(resData));
    });
});

// Retrieve all searched travel listings
app.get("/travels/search/:country/:price/:travel_period/", (req, res) => {
    var travelInfo = req.params;
    travels.getTravelsSearch(travelInfo, (err, result) => {
        var resData = {};
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
            resData = result;
        }
        res.send(JSON.stringify(resData));
    });
});

// Retrieve a travel listing
app.get("/travels/:travel_id/", checkParams, (req, res) => {
    var travelInfo = req.params;
    travels.getTravel(travelInfo, (err, result) => {
        var resData = {};
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
            for (const travel of result) {
                delete travel.travel_id;
            }
            resData = result[0];
        }
        res.send(JSON.stringify(resData));
    });
});

// Add a new travel listing
app.post("/travels/", isLoggedIn, isAdmin, (req, res) => {
    var travelInfo = req.body;
    travels.addTravel(travelInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateEntry = regexMatches[1];
                var duplicateColumn = regexMatches[2].split('.')[1];
                errorDescription = `The new ${duplicateColumn} provided, ${duplicateEntry}, already exists.`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 201;
            resData = {"travel_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Delete a travel listing
app.delete("/travels/:travel_id/", checkParams, isLoggedIn, isAdmin, (req, res) => {
    var travelInfo = req.params;
    travels.delTravel(travelInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Update a travel listing
app.put("/travels/:travel_id/", checkParams, isLoggedIn, isAdmin, (req, res) => {
    var travelInfo = Object.assign(req.body, req.params);
    travels.updateTravel(travelInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateEntry = regexMatches[1];
                var duplicateColumn = regexMatches[2].split('.')[1];
                errorDescription = `The new ${duplicateColumn} provided, ${duplicateEntry}, already exists.`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Handle itineraries related requests

// Retrieve all itineraries of a travel listing
app.get("/travels/:fk_travel_id/itineraries/", checkParams, (req, res) => {
    var itineraryInfo = req.params;
    itineraries.getItineraries(itineraryInfo, (err, result) => {
        var resData = {};
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
            for (const itinerary of result) {
                delete itinerary.fk_travel_id;
            }
            resData = result;
        }
        res.send(JSON.stringify(resData));
    });
});

// Add a itinerary for a travel listing
app.post("/travels/:fk_travel_id/itineraries/", checkParams, isLoggedIn, isAdmin, (req, res) => {
    var itineraryInfo = Object.assign(req.body, req.params);
    itineraries.addItinerary(itineraryInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 201;
            resData = {"itinerary_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Handle reviews related requests

// Add a review of a user and a travel listing
app.post("/users/:fk_user_id/travels/:fk_travel_id/reviews/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var reviewInfo = Object.assign(req.body, req.params);
    reviews.addReview(reviewInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateUser = regexMatches[1].split('-')[0];
                var duplicateTravel = regexMatches[1].split('-')[1];
                errorDescription = `This user (user_id: ${duplicateUser}) has already left a review on this travel listing (travel_id: ${duplicateTravel}).`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 201;
            resData = {"review_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Retrieve all reviews of a travel listing
app.get("/travels/:fk_travel_id/reviews/", checkParams, (req, res) => {
    var reviewInfo = req.params;
    reviews.getReviews(reviewInfo, (err, result) => {
        var resData = {};
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
            for (const review of result) {
                delete review.fk_user_id;
                delete review.fk_travel_id;
            }
            resData = result;
        }
        res.send(JSON.stringify(resData));     
    });
});

// Handle promotions related requests

// Retrieve a promotion
app.get("/travels/promotions/:promotion_id/", checkParams, (req, res, next) => {
    var promotionInfo = req.params;
    promotions.getPromotion(promotionInfo, (err, result) => {
        var resData = {};
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
            for (const promotion of result) {
                delete promotion.promotion_id;
                delete promotion.fk_travel_id;
            }
            resData = result[0];
        }
        if (res.statusCode === 200) {
            if (resData === undefined) {
                res.send();
            } else {
                res.resData = resData;
                next();
            }
        } else {
            res.send(JSON.stringify(resData));
        }          
    });
}, addDiscountedPrice);

// Retrieve all promotions of a travel listing
app.get("/travels/:fk_travel_id/promotions/", checkParams, (req, res, next) => {
    var promotionInfo = req.params;
    promotions.getPromotions(promotionInfo, (err, result) => {
        var resData = {};
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
            for (const promotion of result) {
                delete promotion.travel_id;
                delete promotion.fk_travel_id;
            }
            resData = result;
        }
        if (res.statusCode === 200) {
            if (resData.length === 0) {
                res.send();
            } else {
                res.resData = resData;
                next();
            }
        } else {
            res.send(JSON.stringify(resData));
        }           
    });
}, addDiscountedPrices);

// Update a promotion
app.put("/travels/promotions/:promotion_id/", checkParams, checkDiscount, isLoggedIn, isAdmin, (req, res) => {
    var promotionInfo = Object.assign(req.body, req.params);
    promotions.updatePromotion(promotionInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Add a promotion of a travel listing
app.post("/travels/:fk_travel_id/promotions/", checkParams, checkDiscount, isLoggedIn, isAdmin, (req, res) => {
    var promotionInfo = Object.assign(req.body, req.params);
    promotions.addPromotion(promotionInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 201;
            resData = {"promotion_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Delete a promotion
app.delete("/travels/promotions/:promotion_id/", checkParams, isLoggedIn, isAdmin, (req, res) => {
    var promotionInfo = req.params;
    promotions.delPromotion(promotionInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Delete all promotions of a travel listing
app.delete("/travels/:fk_travel_id/promotions/", checkParams, isLoggedIn, isAdmin, (req, res) => {
    var promotionInfo = req.params;
    promotions.delPromotions(promotionInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Handle travel listing images related requests

// Retrieve showcase file of image
app.get("/travels/:fk_travel_id/images/showcase/", checkParams, (req, res) => {
    var imageInfo = req.params;
    images.getImageShowcase(imageInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
            res.send(resData);
        } else {
            console.log(result);
            resData = result[0];
            try {
                res.sendFile(path.join(__dirname, "../../Images", `travel_id_${resData.fk_travel_id}`, `showcase.jpg`));
                console.log(res.body);
            } catch {
                res.send();
            }
        }
    });
});

// Retrieve an image's file 
app.get("/travels/images/:image_id/", checkParams, (req, res) => {
    var imageInfo = req.params;
    images.getImageInfo(imageInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
            res.send(resData);
        } else {
            console.log(result);
            resData = result[0];
            try {
                res.sendFile(path.join(__dirname, "../../Images", `travel_id_${resData.fk_travel_id}`, `${resData.image_path}`));
            } catch {
                res.send();
            }
        }
    });
});

// Retrieve a travel listing and information about its associated images
app.get("/travels/:fk_travel_id/images/", checkParams, (req, res) => {
    var imageInfo = req.params;
    var travelInfo = {"travel_id": imageInfo.fk_travel_id};
    var resData = {};
    res.statusCode = 500;
    var errorDescription = "Internal server error.";
    resData = {
        "error_code": res.statusCode, 
        "error_description": errorDescription
    };
    travels.getTravel(travelInfo, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify(resData));
            return null;
        } else {
            console.log(result);
            if (result.length === 0) {
                res.statusCode = 200;
                res.send();
                return null;
            }
            for (const travel of result) {
                delete travel.travel_id;
            }
            resData = [result[0]];
        }
        images.getImagesInfo(imageInfo, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.statusCode = 200;
                for (const imageInfo of result) {
                    delete imageInfo.fk_travel_id;
                }
                resData.push(result);
            }
            res.send(JSON.stringify(resData));
        });
    });
});

// Update an image
app.put("/travels/images/:image_id/", checkParams, isLoggedIn, isAdmin, checkImage, checkPath, deleteImage, (req, res, next) => {
    var imageInfo = Object.assign(req.body, req.params);
    images.updateImage(imageInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateTravel = regexMatches[1].split('-')[0];
                var duplicatePath = regexMatches[1].split('-')[1];
                errorDescription = `This travel listing (fk_travel_id: ${duplicateTravel}) already has an image file of the same name (image_path: ${duplicatePath}).`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 204;
        }
        if (res.statusCode === 204) {
            res.resData = resData;
            next();
        } else {
            res.send(JSON.stringify(resData));
        }
    });   
}, uploadImage);

// Add an image of a travel listing
app.post("/travels/:fk_travel_id/images/", checkParams, isLoggedIn, isAdmin, checkImage, checkPath, (req, res, next) => {
    var imageInfo = Object.assign(req.body, req.params);
    images.addImage(imageInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateTravel = regexMatches[1].split('-')[0];
                var duplicatePath = regexMatches[1].split('-')[1];
                errorDescription = `This travel listing (fk_travel_id: ${duplicateTravel}) already has an image file of the same name (image_path: ${duplicatePath}).`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 201;
            resData = {"image_id": result.insertId};
        }
        if (res.statusCode === 201) {
            res.resData = resData;
            next();
        } else {
            res.send(JSON.stringify(resData));
        }
    });   
}, uploadImage);

// Handle shopping cart related requests

// Retrieve shopping cart contents of a user
app.get("/users/:fk_user_id/carts/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var cartInfo = req.params;
    carts.getCart(cartInfo, (err, result) => {
        var resData = {};
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
            for (const cart of result) {
                delete cart.fk_user_id;
            }
            resData = result;
        }
        res.send(JSON.stringify(resData));
    });
});

// Add travel listing to user's shopping cart
app.post("/users/:fk_user_id/travels/:fk_travel_id/carts/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var cartInfo = req.params;
    carts.addCart(cartInfo, (err, result) => {
        var resData = {};
        if (err) {
            console.log(err);
            res.statusCode = 500;
            var errorDescription = "Internal server error.";
            if (err.code === "ER_DUP_ENTRY") {
                res.statusCode = 422;
                var regexPattern = new RegExp("\\'(.+)\\'.+\\'(.+)\\'");
                var regexMatches = err.sqlMessage.match(regexPattern);
                var duplicateUser = regexMatches[1].split('-')[0];
                var duplicateTravel = regexMatches[1].split('-')[1];
                errorDescription = `This user (user_id: ${duplicateUser}) has already added this travel listing (travel_id: ${duplicateTravel}) to their shopping cart.`;
            }
            resData = {
                "error_code": res.statusCode, 
                "error_description": errorDescription
            };
        } else {
            console.log(result);
            res.statusCode = 201;
            resData = {"cart_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

// Delete shopping cart contents of user
app.delete("/users/:fk_user_id/carts/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var cartInfo = req.params;
    carts.delCart(cartInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 204;
        }
        res.send(JSON.stringify(resData));
    });
});

// Handle purchases related requests

// Add purchases of user
app.post("/users/:fk_user_id/travels/:fk_travel_id/purchases/", checkParams, isLoggedIn, isIdentity, (req, res) => {
    var purchaseInfo = req.params;
    purchases.addPurchase(purchaseInfo, (err, result) => {
        var resData = {};
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
            res.statusCode = 201;
            resData = {"purchase_id": result.insertId};
        }
        res.send(JSON.stringify(resData));
    });
});

module.exports = app;



// const authHeader = req.headers.authorization;
// if (
//     authHeader === null ||
//     authHeader === undefined ||
//     !authHeader.startsWith("Bearer ")
// ) {
//     console.log(authHeader);
//     res.status(401).send({
//         "error_code": res.statusCode,
//         "error_description": "Unauthorized client error. Token not found."
//     });
//     return;
// }
// const token = authHeader.replace("Bearer ", "");
// jwt.verify(token, JWT_SECRET, {algorithms: ["HS256"]}, (err, decodedToken) => {
//     if (err) {
//         res.status(401).send({
//             "error_code": res.statusCode,
//             "error_description": "Unauthorized client error. Invalid token."
//         });
//         return;
//     }
//     if (decodedToken.role !== "admin") {
//         res.status(403).send({
//             "error_code": res.statusCode,
//             "error_description": "Forbidden. Not admin.",
//         });
//         return;
//     } 
//     res.send();
// });