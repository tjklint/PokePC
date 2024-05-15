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
        entry VARCHAR(1000),
        category VARCHAR(1000),
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

INSERT INTO pokemon_species (name, type, category, description, userImageURL) VALUES
('Bulbasaur', 'Grass/Poison', 'Seed Pokémon', 'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif'),
('Ivysaur', 'Grass/Poison', 'Seed Pokémon', 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/2.gif'),
('Venusaur', 'Grass/Poison', 'Seed Pokémon', 'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif'),
('Charmander', 'Fire', 'Lizard Pokémon', 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif'),
('Charmeleon', 'Fire', 'Flame Pokémon', 'When it swings its burning tail, it elevates the temperature to unbearably high levels.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/5.gif'),
('Charizard', 'Fire/Flying', 'Flame Pokémon', 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif'),
('Squirtle', 'Water', 'Tiny Turtle Pokémon', 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif'),
('Wartortle', 'Water', 'Turtle Pokémon', 'Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/8.gif'),
('Blastoise', 'Water', 'Shellfish Pokémon', 'A brutal POKéMON with pressurized water jets on its shell. They are used for high speed tackles.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/9.gif'),
('Caterpie', 'Bug', 'Worm Pokémon', 'Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/10.gif'),
('Metapod', 'Bug', 'Cocoon Pokémon', 'This POKéMON is vulnerable to attack while its shell is soft, exposing its weak and tender body.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/11.gif'),
('Butterfree', 'Bug/Flying', 'Butterfly Pokémon', 'In battle, it flaps its wings at high speed to release highly toxic dust into the air.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/12.gif'),
('Weedle', 'Bug/Poison', 'Hairy Bug Pokémon', 'Often found in forests, eating leaves. It has a sharp venomous stinger on its head.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/13.gif'),
('Kakuna', 'Bug/Poison', 'Cocoon Pokémon', 'Almost incapable of moving, this POKéMON can only harden its shell to protect itself from predators.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/14.gif'),
('Beedrill', 'Bug/Poison', 'Poison Bee Pokémon', 'It has three poisonous stingers on its forelegs and its tail. They are used to jab its enemy repeatedly.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/15.gif'),
('Pidgey', 'Normal/Flying', 'Tiny Bird Pokémon', 'A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/16.gif'),
('Pidgeotto', 'Normal/Flying', 'Bird Pokémon', 'Very protective of its sprawling territorial area, this POKéMON will fiercely peck at any intruder.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/17.gif'),
('Pidgeot', 'Normal/Flying', 'Bird Pokémon', 'When hunting, it skims the surface of water at high speed to pick off unwary prey such as MAGIKARP.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/18.gif'),
('Rattata', 'Normal', 'Mouse Pokémon', 'Bites anything when it attacks. Small and very quick, it is a common sight in many places.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/19.gif'),
('Raticate', 'Normal', 'Mouse Pokémon', 'It uses its whiskers to maintain its balance. It apparently slows down if they are cut off.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/20.gif'),
('Spearow', 'Normal/Flying', 'Tiny Bird Pokémon', 'It flaps its small wings busily to fly. Using its beak, it searches in grass for prey.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/21.gif'),
('Fearow', 'Normal/Flying', 'Beak Pokémon', 'With its huge and magnificent wings, it can keep aloft without ever having to land for rest.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/22.gif'),
('Ekans', 'Poison', 'Snake Pokémon', 'Moves silently and stealthily. Eats the eggs of birds, such as PIDGEY and SPEAROW, whole.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/23.gif'),
('Arbok', 'Poison', 'Cobra Pokémon', 'It is rumored that the ferocious warning markings on its belly differ from area to area.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/24.gif'),
('Pikachu', 'Electric', 'Mouse Pokémon', 'When several of these POKéMON gather, their electricity could build and cause lightning storms.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'),
('Raichu', 'Electric', 'Mouse Pokémon', 'Its long tail serves as a ground to protect itself from its own high-voltage power.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/26.gif'),
('Sandshrew', 'Ground', 'Mouse Pokémon', 'Burrows deep underground in arid locations far from water. It only emerges to hunt for food.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/27.gif'),
('Sandslash', 'Ground', 'Mouse Pokémon', 'Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/28.gif'),
('Nidoran-f', 'Poison', 'Poison Pin Pokémon', 'Although small, its venomous barbs render this POKéMON dangerous. The female has smaller horns.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/29.gif'),
('Nidorina', 'Poison', 'Poison Pin Pokémon', 'The female''s horn develops slowly. Prefers physical attacks such as clawing and biting.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/30.gif'),
('Nidoqueen', 'Poison/Ground', 'Drill Pokémon', 'Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/31.gif'),
('Nidoran-m', 'Poison', 'Poison Pin Pokémon', 'Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/32.gif'),
('Nidorino', 'Poison', 'Poison Pin Pokémon', 'An aggressive POKéMON that is quick to attack. The horn on its head secretes a powerful venom.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/33.gif'),
('Nidoking', 'Poison/Ground', 'Drill Pokémon', 'It uses its powerful tail in battle to smash, constrict, then break the prey''s bones.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/34.gif'),
('Clefairy', 'Fairy', 'Fairy Pokémon', 'Its magical and cute appeal has many admirers. It is rare and found only in certain areas.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/35.gif'),
('Clefable', 'Fairy', 'Fairy Pokémon', 'A timid fairy POKéMON that is rarely seen. It will run and hide the moment it senses people.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/36.gif'),
('Vulpix', 'Fire', 'Fox Pokémon', 'At the time of birth, it has just one tail. The tail splits from its tip as it grows older.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/37.gif'),
('Ninetales', 'Fire', 'Fox Pokémon', 'Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/38.gif'),
('Jigglypuff', 'Normal/Fairy', 'Balloon Pokémon', 'When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/39.gif'),
('Wigglytuff', 'Normal/Fairy', 'Balloon Pokémon', 'The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/40.gif'),
('Zubat', 'Poison/Flying', 'Bat Pokémon', 'Forms colonies in perpetually dark places. Uses ultrasonic waves to identify and approach targets.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/41.gif'),
('Golbat', 'Poison/Flying', 'Bat Pokémon', 'Once it strikes, it will not stop draining energy from the victim even if it gets too heavy to fly.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/42.gif'),
('Oddish', 'Grass/Poison', 'Weed Pokémon', 'During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/43.gif'),
('Gloom', 'Grass/Poison', 'Weed Pokémon', 'The fluid that oozes from its mouth isn''t drool. It is a nectar that is used to attract prey.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/44.gif'),
('Vileplume', 'Grass/Poison', 'Flower Pokémon', 'It has the world''s largest petals. With every step, the petals shake out heavy clouds of toxic pollen.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/45.gif'),
('Paras', 'Bug/Grass', 'Mushroom Pokémon', 'Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/46.gif'),
('Parasect', 'Bug/Grass', 'Mushroom Pokémon', 'A host-parasite pair in which the parasite mushroom has taken over the host bug. Prefers damp places.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/47.gif'),
('Venonat', 'Bug/Poison', 'Insect Pokémon', 'Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/48.gif'),
('Venomoth', 'Bug/Poison', 'Poison Moth Pokémon', 'The dustlike scales covering its wings are color-coded to indicate the kinds of poison it has.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/49.gif'),
('Diglett', 'Ground', 'Mole Pokémon', 'Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/50.gif'),
('Dugtrio', 'Ground', 'Mole Pokémon', 'A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/51.gif'),
('Meowth', 'Normal', 'Scratch Cat Pokémon', 'It washes its face regularly to keep the coin on its forehead spotless. It doesn''t get along with Galarian Meowth.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/52.gif'),
('Persian', 'Normal', 'Classy Cat Pokémon', 'Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/53.gif'),
('Psyduck', 'Water', 'Duck Pokémon', 'While lulling its enemies with its vacant look, this wily POKéMON will use psychokinetic powers.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/54.gif'),
('Golduck', 'Water', 'Duck Pokémon', 'Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/55.gif'),
('Mankey', 'Fighting', 'Pig Monkey Pokémon', 'Extremely quick to anger. It could be docile one moment then thrashing away the next instant.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/56.gif'),
('Primeape', 'Fighting', 'Pig Monkey Pokémon', 'Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/57.gif'),
('Growlithe', 'Fire', 'Puppy Pokémon', 'Very protective of its territory. It will bark and bite to repel intruders from its space.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/58.gif'),
('Arcanine', 'Fire', 'Legendary Pokémon', 'A POKéMON that has been admired since the past for its beauty. It runs agilely as if on wings.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/59.gif'),
('Poliwag', 'Water', 'Tadpole Pokémon', 'Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/60.gif'),
('Poliwhirl', 'Water', 'Tadpole Pokémon', 'Capable of living in or out of water. When out of water, it sweats to keep its body slimy.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/61.gif'),
('Poliwrath', 'Water/Fighting', 'Tadpole Pokémon', 'An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/62.gif'),
('Abra', 'Psychic', 'Psi Pokémon', 'Using its ability to read minds, it will identify impending danger and TELEPORT to safety.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/63.gif'),
('Kadabra', 'Psychic', 'Psi Pokémon', 'It emits special alpha waves from its body that induce headaches just by being close by.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/64.gif'),
('Alakazam', 'Psychic', 'Psi Pokémon', 'Its brain can out perform a super computer. Its intelligence quotient is said to be 5,000.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/65.gif'),
('Machop', 'Fighting', 'Superpower Pokémon', 'Loves to build its muscles. It trains in all styles of martial arts to become even stronger.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/66.gif'),
('Machoke', 'Fighting', 'Superpower Pokémon', 'Its muscular body is so powerful, it must wear a power save belt to be able to regulate its motions.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/67.gif'),
('Machamp', 'Fighting', 'Superpower Pokémon', 'Using its heavy muscles, it throws powerful punches that can send the victim clear over the horizon.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/68.gif'),
('Bellsprout', 'Grass/Poison', 'Flower Pokémon', 'A carnivorous POKéMON that traps and eats bugs. It uses its root feet to soak up needed moisture.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/69.gif'),
('Weepinbell', 'Grass/Poison', 'Flycatcher Pokémon', 'It spits out POISONPOWDER to immobilize the enemy and then finishes it with a spray of ACID.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/70.gif'),
('Victreebel', 'Grass/Poison', 'Flycatcher Pokémon', 'Said to live in huge colonies deep in jungles, although no one has ever returned from there.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/71.gif'),
('Tentacool', 'Water/Poison', 'Jellyfish Pokémon', 'Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/72.gif'),
('Tentacruel', 'Water/Poison', 'Jellyfish Pokémon', 'The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/73.gif'),
('Geodude', 'Rock/Ground', 'Rock Pokémon', 'Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/74.gif'),
('Graveler', 'Rock/Ground', 'Rock Pokémon', 'Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/75.gif'),
('Golem', 'Rock/Ground', 'Megaton Pokémon', 'Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/76.gif'),
('Ponyta', 'Fire', 'Fire Horse Pokémon', 'Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/77.gif'),
('Rapidash', 'Fire', 'Fire Horse Pokémon', 'Very competitive, this POKéMON will chase anything that moves fast in the hopes of racing it.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/78.gif'),
('Slowpoke', 'Water/Psychic', 'Dopey Pokémon', 'Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/79.gif'),
('Slowbro', 'Water/Psychic', 'Hermit Crab Pokémon', 'The SHELLDER that is latched onto SLOWPOKE''s tail is said to feed on the host''s left over scraps.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/80.gif'),
('Magnemite', 'Electric/Steel', 'Magnet Pokémon', 'Uses anti-gravity to stay suspended. Appears without warning and uses THUNDER WAVE and similar moves.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/81.gif'),
('Magneton', 'Electric/Steel', 'Magnet Pokémon', 'Formed by several MAGNEMITEs linked together. They frequently appear when sunspots flare up.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/82.gif'),
('Farfetchd', 'Normal/Flying', 'Wild Duck Pokémon', 'The sprig of green onions it holds is its weapon. It is used much like a metal sword.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/83.gif'),
('Doduo', 'Normal/Flying', 'Twin Bird Pokémon', 'A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/84.gif'),
('Dodrio', 'Normal/Flying', 'Triple Bird Pokémon', 'Uses its three brains to execute complex plans. While two heads sleep, one head stays awake.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/85.gif'),
('Seel', 'Water', 'Sea Lion Pokémon', 'The protruding horn on its head is very hard. It is used for bashing through thick ice.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/86.gif'),
('Dewgong', 'Water/Ice', 'Sea Lion Pokémon', 'Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/87.gif'),
('Grimer', 'Poison', 'Sludge Pokémon', 'Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/88.gif'),
('Muk', 'Poison', 'Sludge Pokémon', 'Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/89.gif'),
('Shellder', 'Water', 'Bivalve Pokémon', 'Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/90.gif'),
('Cloyster', 'Water/Ice', 'Bivalve Pokémon', 'When attacked, it launches its horns in quick volleys. Its innards have never been seen.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/91.gif'),
('Gastly', 'Ghost/Poison', 'Gas Pokémon', 'Almost invisible, this gaseous POKéMON cloaks the target and puts it to sleep without notice.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/92.gif'),
('Haunter', 'Ghost/Poison', 'Gas Pokémon', 'Because of its ability to slip through block walls, it is said to be from another dimension.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/93.gif'),
('Gengar', 'Ghost/Poison', 'Shadow Pokémon', 'Under a full moon, this POKéMON likes to mimic the shadows of people and laugh at their fright.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif'),
('Onix', 'Rock/Ground', 'Rock Snake Pokémon', 'As it grows, the stone portions of its body harden to become similar to a diamond, but colored black.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/95.gif'),
('Drowzee', 'Psychic', 'Hypnosis Pokémon', 'Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/96.gif'),
('Hypno', 'Psychic', 'Hypnosis Pokémon', 'When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/97.gif'),
('Krabby', 'Water', 'River Crab Pokémon', 'Its pincers are not only powerful weapons, they are used for balance when walking sideways.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/98.gif'),
('Kingler', 'Water', 'Pincer Pokémon', 'The large pincer has 10000 hp of crushing power. However, its huge size makes it unwieldy to use.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/99.gif'),
('Voltorb', 'Electric', 'Ball Pokémon', 'Usually found in power plants. Easily mistaken for a POKé BALL, they have zapped many people.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/100.gif'),
('Electrode', 'Electric', 'Ball Pokémon', 'It stores electric energy under very high pressure. It often explodes with little or no provocation.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/101.gif'),
('Exeggcute', 'Grass/Psychic', 'Egg Pokémon', 'Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/102.gif'),
('Exeggutor', 'Grass/Psychic', 'Coconut Pokémon', 'Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/103.gif'),
('Cubone', 'Ground', 'Lonely Pokémon', 'Because it never removes its skull helmet, no one has ever seen this POKéMON''s real face.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/104.gif'),
('Marowak', 'Ground', 'Bone Keeper Pokémon', 'The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/105.gif'),
('Hitmonlee', 'Fighting', 'Kicking Pokémon', 'When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/106.gif'),
('Hitmonchan', 'Fighting', 'Punching Pokémon', 'While apparently doing nothing, it fires punches in lightning fast volleys that are impossible to see.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/107.gif'),
('Lickitung', 'Normal', 'Licking Pokémon', 'Its tongue can be extended like a chameleon''s. It leaves a tingling sensation when it licks enemies.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/108.gif'),
('Koffing', 'Poison', 'Poison Gas Pokémon', 'Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/109.gif'),
('Weezing', 'Poison', 'Poison Gas Pokémon', 'Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/110.gif'),
('Rhyhorn', 'Ground/Rock', 'Spikes Pokémon', 'A POKéMON with a one-track mind. Once it charges,  it won''t stop running until it falls asleep.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/111.gif'),
('Rhydon', 'Ground/Rock', 'Drill Pokémon', 'Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/112.gif'),
('Chansey', 'Normal', 'Egg Pokémon', 'A rare and elusive POKéMON that is said to bring happiness to those who manage to get it.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/113.gif'),
('Tangela', 'Grass', 'Vine Pokémon', 'The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/114.gif'),
('Kangaskhan', 'Normal', 'Parent Pokémon', 'The infant rarely ventures out of its mother''s protective pouch until it is 3 years old.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/115.gif'),
('Horsea', 'Water', 'Dragon Pokémon', 'Known to shoot down flying bugs with precision blasts of ink from the surface of the water.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/116.gif'),
('Seadra', 'Water', 'Dragon Pokémon', 'Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/117.gif'),
('Goldeen', 'Water', 'Goldfish Pokémon', 'Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/118.gif'),
('Seaking', 'Water', 'Goldfish Pokémon', 'In the autumn spawning season, they can be seen swimming powerfully up rivers and creeks.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/119.gif'),
('Staryu', 'Water', 'Star Shape Pokémon', 'If its body is torn, it can grow back if the red core remains. The core flashes at midnight.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/120.gif'),
('Starmie', 'Water/Psychic', 'Mysterious Pokémon', 'Its central core glows with the seven colors of the rainbow. Some people value the core as a gem.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/121.gif'),
('Mr-mime', 'Psychic/Fairy', 'Barrier Pokémon', 'If interrupted while it is miming, it will slap around the offender with its broad hands.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/122.gif'),
('Scyther', 'Bug/Flying', 'Mantis Pokémon', 'With ninja-like agility and speed, it can create the illusion that there is more than one.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/123.gif'),
('Jynx', 'Ice/Psychic', 'Human Shape Pokémon', 'It seductively wiggles its hips as it walks. It can cause people to dance in unison with it.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/124.gif'),
('Electabuzz', 'Electric', 'Electric Pokémon', 'Normally found near power plants, they can wander away and cause major blackouts in cities.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/125.gif'),
('Magmar', 'Fire', 'Spitfire Pokémon', 'Its body always burns with an orange glow that enables it to hide perfectly among flames.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/126.gif'),
('Pinsir', 'Bug', 'Stag Beetle Pokémon', 'If it fails to crush the victim in its pincers, it will swing it around and toss it hard.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/127.gif'),
('Tauros', 'Normal', 'Wild Bull Pokémon', 'When it targets an enemy, it charges furiously while whipping its body with its long tails.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/128.gif'),
('Magikarp', 'Water', 'Fish Pokémon', 'In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/129.gif'),
('Gyarados', 'Water/Flying', 'Atrocious Pokémon', 'Once it begins to rampage, a GYARADOS will burn everything down, even in a harsh storm.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/130.gif'),
('Lapras', 'Water/Ice', 'Transport Pokémon', 'A POKéMON that has been overhunted almost to extinction. It can ferry people across the water.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/131.gif'),
('Ditto', 'Normal', 'Transform Pokémon', 'Capable of copying an enemy''s genetic code to instantly transform itself into a duplicate of the enemy.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/132.gif'),
('Eevee', 'Normal', 'Evolution Pokémon', 'Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif'),
('Vaporeon', 'Water', 'Bubble Jet Pokémon', 'Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid''s.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/134.gif'),
('Jolteon', 'Electric', 'Lightning Pokémon', 'It accumulates negative ions in the atmosphere to blast out 10000- volt lightning bolts.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/135.gif'),
('Flareon', 'Fire', 'Flame Pokémon', 'When storing thermal energy in its body, its temperature could soar to over 1600 degrees.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/136.gif'),
('Porygon', 'Normal', 'Virtual Pokémon', 'A POKéMON that consists entirely of programming code. Capable of moving freely in cyberspace.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/137.gif'),
('Omanyte', 'Rock/Water', 'Spiral Pokémon', 'Although long extinct, in rare cases, it can be genetically resurrected from fossils.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/138.gif'),
('Omastar', 'Rock/Water', 'Spiral Pokémon', 'A prehistoric POKéMON that died out when its heavy shell made it impossible to catch prey.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/139.gif'),
('Kabuto', 'Rock/Water', 'Shellfish Pokémon', 'A POKéMON that was resurrected from a fossil found in what was once the ocean floor eons ago.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/140.gif'),
('Kabutops', 'Rock/Water', 'Shellfish Pokémon', 'Its sleek shape is perfect for swimming. It slashes prey with its claws and drains the body fluids.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/141.gif'),
('Aerodactyl', 'Rock/Flying', 'Fossil Pokémon', 'A Pokémon that roamed the skies in the dinosaur era. Its teeth are like saw blades.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/142.gif'),
('Snorlax', 'Normal', 'Sleeping Pokémon', 'Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif'),
('Articuno', 'Ice/Flying', 'Freeze Pokémon', 'A legendary bird POKéMON that is said to appear to doomed people who are lost in icy mountains.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/144.gif'),
('Zapdos', 'Electric/Flying', 'Electric Pokémon', 'A legendary bird POKéMON that is said to appear from clouds while dropping enormous lightning bolts.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/145.gif'),
('Moltres', 'Fire/Flying', 'Flame Pokémon', 'Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/146.gif'),
('Dratini', 'Dragon', 'Dragon Pokémon', 'Long considered a mythical POKéMON until recently when a small colony was found living underwater.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/147.gif'),
('Dragonair', 'Dragon', 'Dragon Pokémon', 'A mystical POKéMON that exudes a gentle aura. Has the ability to change climate conditions.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/148.gif'),
('Dragonite', 'Dragon/Flying', 'Dragon Pokémon', 'An extremely rarely seen marine POKéMON. Its intelligence is said to match that of humans.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif'),
('Mewtwo', 'Psychic', 'Genetic Pokémon', 'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif'),
('Mew', 'Psychic', 'New Species Pokémon', 'So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif');


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

