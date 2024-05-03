DROP DATABASE IF EXISTS "MyDB";
CREATE DATABASE "MyDB";

\c MyDB;

DROP TABLE IF EXISTS table_name;
CREATE TABLE user {
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(200),
        email VARCHAR(100)
    }

CREATE TABLE pokemon_species {
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        type VARCHAR(50),
        userImageURL VARCHAR(255)
    }

CREATE TABLE box {
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        userId INTEGER REFERENCES users(id)       
    }

CREATE TABLE box_species {
        id SERIAL PRIMARY KEY,
        pokemonId INTEGER REFERENCES pokemon_species(id),
        userId INTEGER REFERENCES users(id),
        boxId INTEGER REFERENCES box(id),
        level INTEGER,
        nature VARCHAR(50),
        ability VARCHAR(50)
    }

CREATE TABLE team {
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        userId INTEGER REFERENCES users(id)
    }

CREATE TABLE team_positions {
        teamId INT,
        boxId INT,
        position INT,
        PRIMARY KEY (teamId, boxId),
        FOREIGN KEY (teamId) REFERENCES team(id),
        FOREIGN KEY (boxId) REFERENCES box(id)
    }

CREATE TABLE moves {
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        accuracy INT,
        effect_chance INT,
        pp INT,   
        power INT
    }

CREATE TABLE pokemon_moves {
        box_speciesId INT,
        moveId INT,
        PRIMARY KEY (box_speciesId, moveId), -- Composite primary key
        FOREIGN KEY (box_speciesId) REFERENCES box(id),
        FOREIGN KEY (moveId) REFERENCES moves(id)
    }
