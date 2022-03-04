# Assumptions
/*
1. It is not explicitly stated which columns need to be which tables, so they are interpreted
as best as I can from the assignment brief.

2. It is also not stated which columns are suppose to be unique, so I decided if they should
be unique based on how it would affect the usability of the website.

3. I assumed the images would be stored in the file system of the server, with its relative path
stored in the MySQL database as a reference. It seems that this is the general practice.
*/

# Create a schema to hold all the data
DROP DATABASE IF EXISTS sp_travel;
CREATE DATABASE sp_travel;

USE sp_travel;

# Create table to hold user information
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(3000) NOT NULL,
    profile_pic_url VARCHAR(3000) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id),
    UNIQUE (username),
    UNIQUE (email)
);

# Create table to hold travel listings
CREATE TABLE travels (
    travel_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(3000) NOT NULL,
    price DOUBLE NOT NULL,
    country VARCHAR(255) NOT NULL,
    travel_period VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (travel_id),
    UNIQUE (title)
);

# Create table to hold itineraries for travel listings
CREATE TABLE itineraries (
    itinerary_id INT NOT NULL AUTO_INCREMENT,
    fk_travel_id INT NOT NULL, 
    day INT NOT NULL,
    activity VARCHAR(3000) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (itinerary_id),
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE
);

# Create table to hold reviews for travel listings
CREATE TABLE reviews (
    review_id INT NOT NULL AUTO_INCREMENT,
    fk_user_id INT NOT NULL,
    fk_travel_id INT NOT NULL,
    content VARCHAR(3000) NOT NULL,
    rating DOUBLE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (review_id),
    FOREIGN KEY (fk_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE,
    UNIQUE KEY user_travel_same (fk_user_id, fk_travel_id)
);

# Create table to hold promotions for travel listings
CREATE TABLE promotions (
    promotion_id INT NOT NULL AUTO_INCREMENT,
    fk_travel_id INT NOT NULL,
    promotion_start DATETIME NOT NULL,
    promotion_end DATETIME NOT NULL,
    discount_percentage DOUBLE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (promotion_id),
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE
);

# Create table to hold images for travel listings
CREATE TABLE images (
    image_id INT NOT NULL AUTO_INCREMENT,
    fk_travel_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL, 
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (image_id),
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE,
    UNIQUE KEY travel_image_path (fk_travel_id, image_path)
);

# Create table to hold shopping carts of users
CREATE TABLE carts (
    cart_id INT NOT NULL AUTO_INCREMENT,
    fk_user_id INT NOT NULL,
    fk_travel_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cart_id),
    FOREIGN KEY (fk_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE,
    UNIQUE KEY cart_item (fk_user_id, fk_travel_id)
);

# Create table to hold purchase history of users
CREATE TABLE purchases (
    purchase_id INT NOT NULL AUTO_INCREMENT,
    fk_user_id INT NOT NULL,
    fk_travel_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (purchase_id),
    FOREIGN KEY (fk_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_travel_id) REFERENCES travels(travel_id) ON DELETE CASCADE
);