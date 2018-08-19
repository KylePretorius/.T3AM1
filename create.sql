CREATE DATABASE dbIP;
USE dbIP;
CREATE TABLE Files (
  hash varchar(100) PRIMARY KEY,
  data longblob NOT NULL
);
