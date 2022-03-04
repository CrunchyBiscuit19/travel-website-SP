USE sp_travel;

# Fill the users table (passwords are lowercase "given" names)
INSERT INTO users (username, email, password, profile_pic_url, role)
VALUES ("admin", "admin@admin.com", SHA2("admin", 224), "https://www.admin.com/admin.png", "admin");
INSERT INTO users (username, email, password, profile_pic_url, role)
VALUES ("Atlas Earthquake", "earthquake@atlas.com", SHA2("earthquake", 224), "https://www.atlas.com/earthquake.png", "normal");
INSERT INTO users (username, email, password, profile_pic_url, role)
VALUES ("Springbok Kalahari", "kalahari@springbok.com", SHA2("kalahari", 224), "https://www.springbok.com/kalahari.png", "normal");
INSERT INTO users (username, email, password, profile_pic_url, role)
VALUES ("Italia Cirrus", "cirrus@italia.com", SHA2("cirrus", 224), "https://www.italia.com/cirrus.png", "normal");
INSERT INTO users (username, email, password, profile_pic_url, role)
VALUES ("Wombat Beachmaster", "beachmaster@wombat.com", SHA2("beachmaster", 224), "https://www.wombat.com/beachmaster.png", "normal");

# Get user IDs
SELECT @atlas_earthquake := (SELECT user_id FROM users WHERE username = "Atlas Earthquake");
SELECT @springbok_kalahari := (SELECT user_id FROM users WHERE username = "Springbok Kalahari");
SELECT @italia_cirrus := (SELECT user_id FROM users WHERE username = "Italia Cirrus");
SELECT @wombat_beachmaster := (SELECT user_id FROM users WHERE username = "Wombat Beachmaster");

# Fill the travel listings table
INSERT INTO travels (title, description, price, country, travel_period)
VALUES ("San Francisco 1D2N", "San Francisco is the second largest city in population and smallest in area in San Andreas.", 315.28, "United States of America", "Jan 2020");
INSERT INTO travels (title, description, price, country, travel_period)
VALUES ("Berlin 2D3N", "Berlin is the capital and largest city of Germany by both area and population.", 321.28, "Germany", "Feb 2020");
INSERT INTO travels (title, description, price, country, travel_period)
VALUES ("Singapore 3D4N", "Singapore is a sovereign island city-state in maritime Southeast-Asia.", 326.28, "Singapore", "Mar 2020");
INSERT INTO travels (title, description, price, country, travel_period)
VALUES ("Tokyo 4D5N", "Tokyo is the capital and most populous prefecture of Japan.", 329.28, "Japan", "Apr 2020");
INSERT INTO travels (title, description, price, country, travel_period)
VALUES ("Los Angeles 5D6N", "Los Angeles is the largest city in population and largest in area in San Andreas.", 339.28, "United States of America", "Jan 2020");

# Get travel listing IDs
SELECT @san_francisco := (SELECT travel_id FROM travels WHERE title = "San Francisco 1D2N");
SELECT @berlin := (SELECT travel_id FROM travels WHERE title = "Berlin 2D3N");
SELECT @singapore := (SELECT travel_id FROM travels WHERE title = "Singapore 3D4N");
SELECT @tokyo := (SELECT travel_id FROM travels WHERE title = "Tokyo 4D5N");
SELECT @los_angeles := (SELECT travel_id FROM travels WHERE title = "Los Angeles 5D6N");

# Fill the itineraries of travel listings table
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@san_francisco, 1, "Visit Chinatown.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@berlin, 1, "Book into a hotel.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@berlin, 2, "Visit the Brandenburg Gate.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@singapore, 1, "Eat some local food.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@singapore, 2, "Get drunk at a bar.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@singapore, 3, "Climb to the top of Bukit Timah hill.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@tokyo, 1, "Visit the National Art Gallery.");
INSERT INTO itineraries (fk_travel_id, day, activity)
VALUES (@los_angeles, 1, "Visit the LA river.");

# Fill the reviews of travel listings table
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@atlas_earthquake, @san_francisco, "Very noisy and unpleasant. Nice views though.", 2.5);
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@atlas_earthquake, @berlin, "The people are pleasant, and there are plenty of tourist attractions.", 4.7);
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@springbok_kalahari, @berlin, "I hate this place. Do yourself a favour and avoid coming here.", 0);
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@italia_cirrus, @singapore, "Best place in the world. This review was brought to you by the Singapore Tourism Board.", 5);
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@wombat_beachmaster, @tokyo, "Tokyo R246 was a great circuit.", 3.3);
INSERT INTO reviews (fk_user_id, fk_travel_id, content, rating)
VALUES (@springbok_kalahari, @los_angeles, "Hollywood was a fun experience.", 2.1);

# Fill the promotions of travel listings table
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@san_francisco, "2020-01-10 00:00:00", "2020-01-15 23:59:59", 10);
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@berlin, "2020-02-10 00:00:00", "2020-02-15 23:59:59", 20);
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@singapore, "2020-03-10 00:00:00", "2020-03-15 23:59:59", 30);
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@tokyo, "2020-04-10 00:00:00", "2020-04-15 23:59:59", 40);
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@tokyo, "2020-04-16 00:00:00", "2020-04-20 23:59:59", 35);
INSERT INTO promotions (fk_travel_id, promotion_start, promotion_end, discount_percentage)
VALUES (@los_angeles, "2020-04-16 04:25:00", "2020-04-20 21:52:00", 55);

# Fill the images of travel listings table
INSERT INTO images (fk_travel_id, image_path)
VALUES (@san_francisco, "showcase.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@san_francisco, "map.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@san_francisco, "goldenGateBridge.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@berlin, "showcase.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@berlin, "map.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@berlin, "brandenburgGate.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@singapore, "showcase.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@singapore, "map.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@singapore, "merlion.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@singapore, "marinaBaySands.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@tokyo, "showcase.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@tokyo, "map.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@tokyo, "r246.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@los_angeles, "showcase.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@los_angeles, "map.jpg");
INSERT INTO images (fk_travel_id, image_path)
VALUES (@los_angeles, "skyline.jpg");

# Fill the carts of users table
INSERT INTO carts (fk_user_id, fk_travel_id)
VALUES (@atlas_earthquake, @san_francisco);
INSERT INTO carts (fk_user_id, fk_travel_id)
VALUES (@springbok_kalahari, @berlin);
INSERT INTO carts (fk_user_id, fk_travel_id)
VALUES (@italia_cirrus, @singapore);
INSERT INTO carts (fk_user_id, fk_travel_id)
VALUES (@wombat_beachmaster, @tokyo);

# Fill the purchases of users table
INSERT INTO purchases (fk_user_id, fk_travel_id)
VALUES (@atlas_earthquake, @tokyo);
INSERT INTO purchases (fk_user_id, fk_travel_id)
VALUES (@springbok_kalahari, @singapore);
INSERT INTO purchases (fk_user_id, fk_travel_id)
VALUES (@italia_cirrus, @berlin);
INSERT INTO purchases (fk_user_id, fk_travel_id)
VALUES (@wombat_beachmaster, @san_francisco);