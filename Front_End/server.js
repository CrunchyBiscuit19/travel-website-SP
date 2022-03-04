// npm run --prefix .\Front_End\ start-dev

// Import the modules here
const express = require("express");

// Import middleware files here
const checkParams = require("./middleware/checkParams.js");

// Miscellaneous
process.chdir(__dirname);
const app = express();
const rootDir = `${process.cwd()}/public`;

// Send static files when requested
app.use("/css/", express.static("css"));
app.use("/js/", express.static("javascript_files"));
app.use("/favicon/", express.static("public/favicon"));
app.use("/miscellaneous/", express.static("public/miscellaneous"));
app.use("/social_media_icons/", express.static("public/social_media_icons"));

// Get homepage
app.get("/", (req, res) => {
    res.sendFile("index.html", {"root": rootDir});
});

// Get login page
app.get("/login/", (req, res) => {
    res.sendFile("login.html", {"root": rootDir});
});

// Get all travel listings page
app.get("/travels/", (req, res) => {
    res.sendFile("travels.html", {"root": rootDir});
});

// Get searched travel listings page
app.get("/travels/:country/:cost/:travel_period/", (req, res) => {
    res.sendFile("travels.html", {"root": rootDir});
});

// Get full information of travel lisitng page
app.get("/travels/:travel_id/", checkParams, (req, res) => {
    if (res.statusCode === 400) {
        res.sendFile("noExist.html", {"root": rootDir});
        return null;
    }
    res.sendFile("travel.html", {"root": rootDir});
});

// Get admin dashboard
app.get("/admin/", (req, res) => {
    res.sendFile("admin.html", {"root": rootDir});
});

// Get admin add travel listing page
app.get("/admin/add/", (req, res) => {
    res.sendFile("add.html", {"root": rootDir});
});

// Get admin travel listing management page
app.get("/admin/manage/:travel_id/", checkParams, (req, res) => {
    if (res.statusCode === 400) {
        res.sendFile("noExist.html", {"root": rootDir});
        return null;
    }
    res.sendFile("manage.html", {"root": rootDir});
});

// Get user's shopping cart page
app.get("/users/", (req, res) => {
    res.sendFile("user.html", {"root": rootDir});
})

// Get no permission page for normal user trying to access admin webpages
app.get("/noPermission/", (req, res) => {
    res.sendFile("noPermission.html", {"root": rootDir});
});

// To handle non-existent routes
app.use((req, res) => {
    res.statusCode = 404;
    res.sendFile("noExist.html", {"root": rootDir});
});

// Starting the server and listen for requests
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Client server listening at http://localhost:${PORT}`);
});
