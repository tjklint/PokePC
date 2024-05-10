import requests

# Define the base URLs for fetching data and sprites
base_url = 'https://pokeapi.co/api/v2/pokemon/'
sprite_url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/animated/'

# Initialize the list for storing Pokemon data
pokemon_data = []

# Fetch the first 151 Pokémon
for pokemon_id in range(1, 152):
    # Fetch Pokémon information by ID
    response = requests.get(f'{base_url}{pokemon_id}')
    if response.status_code != 200:
        print(f'Error fetching Pokémon with ID {pokemon_id}: {response.status_code}')
        continue

    pokemon_info = response.json()
    pokemon_name = pokemon_info['name'].capitalize()
    
    # Extract the first type (in case of multiple types, just use the first one)
    pokemon_type = pokemon_info['types'][0]['type']['name']
    
    # Construct the URL for the GIF sprite
    sprite_url_full = f'{sprite_url}{pokemon_id}.gif'
    
    # Append the data for SQL insertion
    pokemon_data.append(f"('{pokemon_name}', '{pokemon_type}', '{sprite_url_full}')")

# Combine all values for the SQL insertion statement
values_str = ',\n'.join(pokemon_data)
sql_statement = f"INSERT INTO pokemon_species (name, type, userImageURL) VALUES\n{values_str};"

# Print or save the generated SQL statement
print(sql_statement)
