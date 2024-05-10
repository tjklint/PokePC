DROP DATABASE IF EXISTS "MyDB";
CREATE DATABASE "MyDB";

\c MyDB;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
        id SERIAL PRIMARY KEY,
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
        user_id INTEGER REFERENCES users(id)       
);
DROP TABLE IF EXISTS box_species;
CREATE TABLE box_species (
        id SERIAL PRIMARY KEY,
        pokemon_id INTEGER REFERENCES pokemon_species(id),
        user_id INTEGER REFERENCES users(id),
        box_id INTEGER REFERENCES box(id),
        level INTEGER,
        nature VARCHAR(50),
        ability VARCHAR(50)
);
DROP TABLE IF EXISTS team;
CREATE TABLE team (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        user_id INTEGER REFERENCES users(id)
);
DROP TABLE IF EXISTS team_positions;
CREATE TABLE team_positions (
        team_id INT,
        box_species_id INT,
        position INT,
        PRIMARY KEY (team_id, box_species_id),
        FOREIGN KEY (team_id) REFERENCES team(id),
        FOREIGN KEY (box_species_id) REFERENCES box_species(id)
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
        box_species_id INT,
        move_id INT,
        PRIMARY KEY (box_species_id, move_id),
        FOREIGN KEY (box_species_id) REFERENCES box_species(id),
        FOREIGN KEY (move_id) REFERENCES moves(id)
);

INSERT INTO pokemon_species (name, type, userImageURL) VALUES
('Bulbasaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif'),
('Ivysaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/2.gif'),
('Venusaur', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif'),
('Charmander', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif'),
('Charmeleon', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/5.gif'),
('Charizard', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif'),
('Squirtle', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif'),
('Wartortle', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/8.gif'),
('Blastoise', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/9.gif'),
('Caterpie', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/10.gif'),
('Metapod', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/11.gif'),
('Butterfree', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/12.gif'),
('Weedle', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/13.gif'),
('Kakuna', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/14.gif'),
('Beedrill', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/15.gif'),
('Pidgey', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/16.gif'),
('Pidgeotto', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/17.gif'),
('Pidgeot', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/18.gif'),
('Rattata', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/19.gif'),
('Raticate', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/20.gif'),
('Spearow', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/21.gif'),
('Fearow', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/22.gif'),
('Ekans', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/23.gif'),
('Arbok', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/24.gif'),
('Pikachu', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'),
('Raichu', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/26.gif'),
('Sandshrew', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/27.gif'),
('Sandslash', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/28.gif'),
('Nidoran-f', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/29.gif'),
('Nidorina', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/30.gif'),
('Nidoqueen', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/31.gif'),
('Nidoran-m', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/32.gif'),
('Nidorino', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/33.gif'),
('Nidoking', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/34.gif'),
('Clefairy', 'fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/35.gif'),
('Clefable', 'fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/36.gif'),
('Vulpix', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/37.gif'),
('Ninetales', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/38.gif'),
('Jigglypuff', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/39.gif'),
('Wigglytuff', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/40.gif'),
('Zubat', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/41.gif'),
('Golbat', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/42.gif'),
('Oddish', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/43.gif'),
('Gloom', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/44.gif'),
('Vileplume', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/45.gif'),
('Paras', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/46.gif'),
('Parasect', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/47.gif'),
('Venonat', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/48.gif'),
('Venomoth', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/49.gif'),
('Diglett', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/50.gif'),
('Dugtrio', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/51.gif'),
('Meowth', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/52.gif'),
('Persian', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/53.gif'),
('Psyduck', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/54.gif'),
('Golduck', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/55.gif'),
('Mankey', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/56.gif'),
('Primeape', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/57.gif'),
('Growlithe', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/58.gif'),
('Arcanine', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/59.gif'),
('Poliwag', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/60.gif'),
('Poliwhirl', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/61.gif'),
('Poliwrath', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/62.gif'),
('Abra', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/63.gif'),
('Kadabra', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/64.gif'),
('Alakazam', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/65.gif'),
('Machop', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/66.gif'),
('Machoke', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/67.gif'),
('Machamp', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/68.gif'),
('Bellsprout', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/69.gif'),
('Weepinbell', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/70.gif'),
('Victreebel', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/71.gif'),
('Tentacool', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/72.gif'),
('Tentacruel', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/73.gif'),
('Geodude', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/74.gif'),
('Graveler', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/75.gif'),
('Golem', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/76.gif'),
('Ponyta', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/77.gif'),
('Rapidash', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/78.gif'),
('Slowpoke', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/79.gif'),
('Slowbro', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/80.gif'),
('Magnemite', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/81.gif'),
('Magneton', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/82.gif'),
('Farfetchd', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/83.gif'),
('Doduo', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/84.gif'),
('Dodrio', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/85.gif'),
('Seel', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/86.gif'),
('Dewgong', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/87.gif'),
('Grimer', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/88.gif'),
('Muk', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/89.gif'),
('Shellder', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/90.gif'),
('Cloyster', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/91.gif'),
('Gastly', 'ghost', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/92.gif'),
('Haunter', 'ghost', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/93.gif'),
('Gengar', 'ghost', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif'),
('Onix', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/95.gif'),
('Drowzee', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/96.gif'),
('Hypno', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/97.gif'),
('Krabby', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/98.gif'),
('Kingler', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/99.gif'),
('Voltorb', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/100.gif'),
('Electrode', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/101.gif'),
('Exeggcute', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/102.gif'),
('Exeggutor', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/103.gif'),
('Cubone', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/104.gif'),
('Marowak', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/105.gif'),
('Hitmonlee', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/106.gif'),
('Hitmonchan', 'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/107.gif'),
('Lickitung', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/108.gif'),
('Koffing', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/109.gif'),
('Weezing', 'poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/110.gif'),
('Rhyhorn', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/111.gif'),
('Rhydon', 'ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/112.gif'),
('Chansey', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/113.gif'),
('Tangela', 'grass', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/114.gif'),
('Kangaskhan', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/115.gif'),
('Horsea', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/116.gif'),
('Seadra', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/117.gif'),
('Goldeen', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/118.gif'),
('Seaking', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/119.gif'),
('Staryu', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/120.gif'),
('Starmie', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/121.gif'),
('Mr-mime', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/122.gif'),
('Scyther', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/123.gif'),
('Jynx', 'ice', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/124.gif'),
('Electabuzz', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/125.gif'),
('Magmar', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/126.gif'),
('Pinsir', 'bug', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/127.gif'),
('Tauros', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/128.gif'),
('Magikarp', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/129.gif'),
('Gyarados', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/130.gif'),
('Lapras', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/131.gif'),
('Ditto', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/132.gif'),
('Eevee', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif'),
('Vaporeon', 'water', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/134.gif'),
('Jolteon', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/135.gif'),
('Flareon', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/136.gif'),
('Porygon', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/137.gif'),
('Omanyte', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/138.gif'),
('Omastar', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/139.gif'),
('Kabuto', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/140.gif'),
('Kabutops', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/141.gif'),
('Aerodactyl', 'rock', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/142.gif'),
('Snorlax', 'normal', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif'),
('Articuno', 'ice', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/144.gif'),
('Zapdos', 'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/145.gif'),
('Moltres', 'fire', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/146.gif'),
('Dratini', 'dragon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/147.gif'),
('Dragonair', 'dragon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/148.gif'),
('Dragonite', 'dragon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif'),
('Mewtwo', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif'),
('Mew', 'psychic', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif');

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

