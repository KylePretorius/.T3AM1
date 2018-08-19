CREATE DATABASE dbIP;
USE dbIP;
CREATE TABLE Files (
  hash varchar(100) PRIMARY KEY,
  path varchar(100) NOT NULL
);
