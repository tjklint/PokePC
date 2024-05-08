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

INSERT INTO pokemon_species (name, type, userImageURL) VALUES
('bulbasaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
('ivysaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'),
('venusaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'),
('charmander', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'),
('charmeleon', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png'),
('charizard', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'),
('squirtle', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'),
('wartortle', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png'),
('blastoise', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'),
('caterpie', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png'),
('metapod', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png'),
('butterfree', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png'),
('weedle', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png'),
('kakuna', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png'),
('beedrill', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png'),
('pidgey', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png'),
('pidgeotto', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png'),
('pidgeot', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png'),
('rattata', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png'),
('raticate', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png'),
('spearow', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png'),
('fearow', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png'),
('ekans', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png'),
('arbok', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png'),
('pikachu', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'),
('raichu', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png'),
('sandshrew', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png'),
('sandslash', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png'),
('nidoran-f', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png'),
('nidorina', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png'),
('nidoqueen', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png'),
('clefairy', 'fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png'),
('clefable', 'fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png'),
('vulpix', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png'),
('ninetales', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png'),
('jigglypuff', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png'),
('wigglytuff', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png');


