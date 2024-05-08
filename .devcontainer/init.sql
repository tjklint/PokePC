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

INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Flame Burst', 85, 20, 15, 70);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Ice Fang', 90, 15, 15, 65);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Thunder Strike', 80, 30, 10, 90);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Shadow Claw', 95, 10, 20, 75);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Rock Slide', 85, 20, 10, 85);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Psychic Blast', 100, 10, 15, 90);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Water Pulse', 90, 20, 15, 60);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Solar Beam', 100, 0, 10, 120);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Steel Wing', 85, 10, 20, 70);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Dragon Breath', 95, 30, 15, 60);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Leaf Tornado', 80, 15, 15, 65);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Bug Bite', 90, 0, 20, 60);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Fairy Wind', 100, 0, 15, 60);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Poison Jab', 85, 20, 15, 80);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Ghostly Aura', 90, 25, 10, 70);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Mud Shot', 95, 20, 15, 55);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Thunder Fang', 85, 15, 15, 70);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Flying Press', 90, 10, 10, 100);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Shadow Punch', 100, 0, 20, 60);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Fiery Dance', 85, 20, 15, 80);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Aqua Jet', 95, 10, 20, 50);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Blizzard', 70, 30, 5, 110);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Hyper Beam', 90, 0, 5, 150);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Sludge Bomb', 80, 30, 10, 90);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Energy Ball', 100, 20, 15, 80);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Cross Chop', 80, 10, 5, 100);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Dark Pulse', 95, 30, 15, 80);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Iron Head', 85, 20, 15, 90);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Acid Spray', 100, 40, 20, 50);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Sky Uppercut', 80, 15, 10, 85);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Shadow Force', 95, 0, 5, 120);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Flash Cannon', 100, 10, 10, 80);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Searing Shot', 90, 15, 10, 100);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Aurora Beam', 95, 20, 20, 65);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Hex', 100, 0, 15, 65);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Overheat', 70, 0, 5, 130);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Thunder Wave', 90, 20, 20, 0);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Toxic', 85, 30, 10, 0);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Inferno', 50, 50, 5, 100);
INSERT INTO moves (name, accuracy, effect_chance, pp, power) VALUES ('Hyper Fang', 90, 20, 15, 80);

