let currentPokemonId = 1;

async function fetchPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        const speciesData = await fetchSpeciesData(data.species.url);
        displayPokemon(data, speciesData);
    } else {
        document.getElementById('pokemonData').innerHTML = `<p class="text-danger">Pokémon not found. Please try again.</p>`;
        document.getElementById('evolutionChain').innerHTML = '';
    }
}

async function fetchSpeciesData(speciesUrl) {
    const response = await fetch(speciesUrl);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return null;
    }
}

async function displayPokemon(pokemon, speciesData) {
    const pokemonData = `
        <div class="pokemon-card">
            <div class="pokemon-details">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <img class="pokemon-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <div class="pokemon-info">
                    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                </div>
            </div>
        </div>
        <div class="pokemon-description">
            <h3>Description</h3>
            <p>${getPokemonDescription(speciesData)}</p>
        </div>
        <div class="pokemon-abilities">
            <h3>Abilities</h3>
            <ul>
                ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
            </ul>
        </div>
        <div class="pokemon-stats">
            <h3>Base Stats</h3>
            ${pokemon.stats.map(stat => `
                <div class="stat">
                    <p class="stat-name">${stat.stat.name}</p>
                    <p class="stat-value">${stat.base_stat}</p>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('pokemonData').innerHTML = pokemonData;

    if (speciesData) {
        const evolutionChain = await fetchEvolutionChain(speciesData.evolution_chain.url);
        displayEvolutionChain(evolutionChain);
    }
}

function getPokemonDescription(speciesData) {
    if (speciesData && speciesData.flavor_text_entries) {
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
        return description ? description.flavor_text.replace(/\n/g, ' ') : 'Description not available.';
    } else {
        return 'Description not available.';
    }
}

async function fetchEvolutionChain(evolutionChainUrl) {
    const response = await fetch(evolutionChainUrl);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return null;
    }
}

function displayEvolutionChain(evolutionChain) {
    const chain = evolutionChain.chain;
    let evolutionHtml = '<div class="evolution"><h3>Evolution Chain</h3>';

    function buildEvolutionTree(chain) {
        const pokemonName = chain.species.name;
        const imageUrl = `https://img.pokemondb.net/sprites/x-y/normal/${pokemonName}.png`;
        evolutionHtml += `<div class="evolution-images">
                            <img src="${imageUrl}" alt="${pokemonName}">
                            <p>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</p>
                          </div>`;
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(evolution => buildEvolutionTree(evolution));
        }
    }

    buildEvolutionTree(chain);
    evolutionHtml += '</div>';
    document.getElementById('evolutionChain').innerHTML = evolutionHtml;
}

async function previousPokemon() {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        await fetchAndDisplayPokemon(currentPokemonId);
    }
}

async function nextPokemon() {
    currentPokemonId++;
    await fetchAndDisplayPokemon(currentPokemonId);
}

async function fetchAndDisplayPokemon(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        const speciesData = await fetchSpeciesData(data.species.url);
        displayPokemon(data, speciesData);
    } else {
        document.getElementById('pokemonData').innerHTML = `<p class="text-danger">Pokémon not found. Please try again.</p>`;
        document.getElementById('evolutionChain').innerHTML = '';
    }
}
