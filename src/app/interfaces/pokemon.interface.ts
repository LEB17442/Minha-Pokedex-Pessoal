// Define a estrutura para um único tipo de Pokémon
export interface PokemonType {
  type: {
    name: string;
  };
}

// NOVA: Define a estrutura para uma habilidade
export interface PokemonAbility {
  ability: {
    name: string;
  };
}

// NOVA: Define a estrutura para um stat
export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonVariety {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

// NOVA: Define a estrutura da cadeia de evolução da API
export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

// Atualize a interface PokemonSpecies
export interface PokemonSpecies {
  varieties: PokemonVariety[];
  evolution_chain: { // Precisamos desta URL
    url: string;
  };
  flavor_text_entries: FlavorTextEntry[];
}

// Define a estrutura principal do objeto Pokémon
export interface Pokemon {
  id: number | string; 
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string; 
    versions?: { 
      'generation-v': {
        'black-white': {
          animated: {
            front_default: string;
            front_shiny: string;
          }
        }
      }
    }
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  species: {
    url: string; // Precisamos disso para encontrar as variações
  };
  stats: PokemonStat[];
  cries: {
    latest: string;
    legacy: string;
  };
  height: number; 
  weight: number; 
  animatedSprite?: string; 
}