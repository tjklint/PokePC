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
    response = requests.get(f'{base_url}{pokemon_id}')
    if response.status_code != 200:
        print(f'Error fetching Pokémon with ID {pokemon_id}: {response.status_code}')
        
        continue

    pokemon_info = response.json()
    pokemon_name = pokemon_info['name'].capitalize()
    
    pokemon_type = pokemon_info['types'][0]['type']['name']
    
    sprite_url_full = f'{sprite_url}{pokemon_id}.gif'
    
    pokemon_data.append(f"('{pokemon_name}', '{pokemon_type}', '{sprite_url_full}')")

values_str = ',\n'.join(pokemon_data)
sql_statement = f"INSERT INTO pokemon_species (name, type, userImageURL) VALUES\n{values_str};"

print(sql_statement)
