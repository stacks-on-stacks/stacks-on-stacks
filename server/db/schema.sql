-- Only run this file once. Running it after the database has been created will drop all of the existing tables.

CREATE DATABASE IF NOT EXISTS amigo;

USE amigo;

DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS amigo_feedback;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS users_trips;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS trips;

CREATE TABLE users (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  username VARCHAR(40) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255) DEFAULT 'sogimasogimasogima',
  fb_id VARCHAR(255),
  fb_token VARCHAR(255),
  profile TEXT DEFAULT NULL
);

CREATE TABLE trips (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  dest_name VARCHAR(255) NOT NULL,
  geocode_latitude DOUBLE PRECISION,
  geocode_longitude DOUBLE PRECISION,
  time_start TIMESTAMP NOT NULL,
  time_end TIMESTAMP NOT NULL
);

CREATE TABLE users_trips (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INTEGER,
  trip_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(trip_id) REFERENCES trips(id)
);

CREATE TABLE activities (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  users_trips_id INTEGER NOT NULL,
  activity VARCHAR(255) NOT NULL,
  FOREIGN KEY (users_trips_id) REFERENCES users_trips(id)
);

CREATE TABLE friends (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  friender_id INTEGER NOT NULL,
  friendee_id INTEGER NOT NULL,
  FOREIGN KEY (friender_id) REFERENCES users(id),
  FOREIGN KEY (friendee_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE amigo_feedback (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  author_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY(author_id) REFERENCES users(id),
  FOREIGN KEY(subject_id) REFERENCES users(id)
);

CREATE TABLE blogs (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  author_id INTEGER NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE media (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  blog_id INTEGER,
  trip_id INTEGER,
  user_id INTEGER,
  url TEXT NOT NULL,
  FOREIGN KEY(blog_id) REFERENCES blogs(id),
  FOREIGN KEY(trip_id) REFERENCES trips(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);