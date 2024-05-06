DROP DATABASE IF EXISTS "MyDB";
CREATE DATABASE "MyDB";

\c MyDB;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL
);
DROP TABLE IF EXISTS pokemon_species;
CREATE TABLE pokemon_species (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        type VARCHAR(50),
        userImageURL VARCHAR(255)
);
DROP TABLE IF EXISTS box;
CREATE TABLE box (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        userId INTEGER REFERENCES users(id)       
);
DROP TABLE IF EXISTS box_species;
CREATE TABLE box_species (
        id SERIAL PRIMARY KEY,
        pokemonId INTEGER REFERENCES pokemon_species(id),
        userId INTEGER REFERENCES users(id),
        boxId INTEGER REFERENCES box(id),
        level INTEGER,
        nature VARCHAR(50),
        ability VARCHAR(50)
);
DROP TABLE IF EXISTS team;
CREATE TABLE team (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        userId INTEGER REFERENCES users(id)
);
DROP TABLE IF EXISTS team_positions;
CREATE TABLE team_positions (
        teamId INT,
        boxId INT,
        position INT,
        PRIMARY KEY (teamId, boxId),
        FOREIGN KEY (teamId) REFERENCES team(id),
        FOREIGN KEY (boxId) REFERENCES box(id)
);
DROP TABLE IF EXISTS moves;
CREATE TABLE moves (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        accuracy INT,
        effect_chance INT,
        pp INT,   
        power INT
);
DROP TABLE IF EXISTS pokemon_moves;
CREATE TABLE pokemon_moves (
        box_speciesId INT,
        moveId INT,
        PRIMARY KEY (box_speciesId, moveId),
        FOREIGN KEY (box_speciesId) REFERENCES box(id),
        FOREIGN KEY (moveId) REFERENCES moves(id)
);
