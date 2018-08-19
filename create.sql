--Creates database and table
--Run mysql -u root -p < create.sql
CREATE DATABASE dbIP;
USE dbIP;
CREATE TABLE Files (
  hash varchar(100) PRIMARY KEY,
  data longblob NOT NULL
);
