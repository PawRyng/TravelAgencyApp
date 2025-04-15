CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,      
    password VARCHAR(255) NOT NULL,   
    salt VARCHAR(255) NOT NULL,       
    first_name VARCHAR(100) NOT NULL, 
    last_name VARCHAR(100) NOT NULL,  
    type ENUM('admin', 'user') NOT NULL DEFAULT 'user', 
    active BOOLEAN NOT NULL DEFAULT 1,  
    UNIQUE(email)                       
);

INSERT INTO users (email, password, salt, first_name, last_name, type, active)
VALUES ('admin@example.com', 'hashed_password', 'random_salt', 'Admin', 'User', 'admin', 1);


CREATE TABLE IF NOT EXISTS travels (
    `id` INT AUTO_INCREMENT PRIMARY KEY, 
    `title` VARCHAR(255) NOT NULL ,
    );
    
CREATE TABLE IF NOT EXISTS travel_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    travel_offer_id INT,
    FOREIGN KEY (travel_offer_id) REFERENCES travels(id) ON DELETE CASCADE
);
