import requests

base_url = 'https://pokeapi.co/api/v2/pokemon/'
sprite_url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/animated/'

pokemon_data = []

# At the moment, due to the size of the returned JSON object:
#   - 151 pokemon took: 45 minutes.

# To be honest, there's 250% chance this is suboptimal code
# but also being honest, I don't care! It's 3:00am on a thursday night,
# and I have an 8:30am class tomorrow, so I will doomscroll on TikTok
# until this garbage for loop finally finishes.

for pokemon_id in range(1, 152):
    print(f"Currently fetching dex entry: {pokemon_id}")

    response = requests.get(f'{base_url}{pokemon_id}')
    if response.status_code != 200:
        print(f'Error fetching Pokémon with ID {pokemon_id}: {response.status_code}')
        continue

    pokemon_info = response.json()
    pokemon_name = pokemon_info['name'].capitalize()

    types = [t['type']['name'].capitalize() for t in pokemon_info['types']]
    pokemon_type = '/'.join(types)

    species_response = requests.get(f'https://pokeapi.co/api/v2/pokemon-species/{pokemon_id}/')
    if species_response.status_code != 200:
        print(f'Error fetching Pokémon species with ID {pokemon_id}: {species_response.status_code}')
        continue
    species_info = species_response.json()

    dex_entries = [entry['flavor_text'] for entry in species_info['flavor_text_entries'] if entry['language']['name'] == 'en']
    dex_entry = dex_entries[0].replace('\n', ' ').replace('\f', ' ')

    genera = [genus['genus'] for genus in species_info['genera'] if genus['language']['name'] == 'en']
    pokemon_category = genera[0]

    sprite_url_full = f'{sprite_url}{pokemon_id}.gif'

    pokemon_data.append(f"('{pokemon_name}', '{pokemon_type}', '{pokemon_category}', '{dex_entry}', '{sprite_url_full}')")

values_str = ',\n'.join(pokemon_data)
sql_statement = f"INSERT INTO pokemon_species (name, type, category, description, userImageURL) VALUES\n{values_str};"

print(sql_statement)