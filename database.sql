CREATE DATABASE IF NOT EXISTS booking_db;
USE booking_db;

CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255)
);

CREATE TABLE movies_showtimes (
    movie_id BIGINT NOT NULL,
    showtimes VARCHAR(255),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE reservation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    time VARCHAR(255),
    user_email VARCHAR(255)
);

CREATE TABLE reservation_seats (
    reservation_id BIGINT NOT NULL,
    seats INT,
    FOREIGN KEY (reservation_id) REFERENCES reservation(id)
);