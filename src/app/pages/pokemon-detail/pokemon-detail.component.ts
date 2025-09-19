import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonSpecies, PokemonVariety, FlavorTextEntry, EvolutionChainLink } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  private location = inject(Location);
  
  public typeColors = this.pokemonService.typeColors;
  pokemon?: Pokemon;
  isShiny = false;
  displaySprite = '';
  varieties: PokemonVariety[] = [];
  pokedexDescription = '';
  evolutionChain: { name: string, sprite: string }[] = [];

  backgroundGradient = '';
  iconUrl1: string | null = null;
  iconUrl2: string | null = null;

  ngOnInit(): void {
    // Troca o snapshot por um subscribe
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name');
      if (pokemonName) {
        this.loadPokemonDetails(pokemonName);
        // Rola a página para o topo ao carregar um novo Pokémon
        window.scrollTo(0, 0); 
      }
    });
  }

  loadPokemonDetails(nameOrUrl: string): void {
    const isUrl = nameOrUrl.includes('https://');
    const pokemonObservable = isUrl 
      ? this.pokemonService.getPokemonByUrl(nameOrUrl)
      : this.pokemonService.getPokemonDetails(nameOrUrl);

    pokemonObservable.subscribe(details => {
      this.pokemon = details;
      this.isShiny = false;
      this.displaySprite = details.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || details.sprites.front_default;
      
      this.buildBackgroundStyles();
      
      // A busca por variações e evoluções só precisa acontecer uma vez, na carga inicial
      if (!isUrl) {
        this.evolutionChain = [];
        this.pokemonService.getPokemonSpecies(details.species.url).subscribe(speciesData => {
          this.varieties = speciesData.varieties;
          this.processPokedexDescription(speciesData.flavor_text_entries);
          if (speciesData.evolution_chain?.url) {
            this.pokemonService.getEvolutionChain(speciesData.evolution_chain.url).subscribe(evoData => {
              this.processEvolutionChain(evoData.chain);
            });
          }
        });
      }
    });
  }

  private buildBackgroundStyles(): void {
    if (!this.pokemon || this.pokemon.types.length === 0) {
      this.backgroundGradient = 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)';
      return;
    }

    const type1 = this.pokemon.types[0].type.name;
    const color1 = this.typeColors[type1] || '#A8A878';
    this.iconUrl1 = `url('/images/types/${type1}.svg')`;

    if (this.pokemon.types.length > 1) {
      const type2 = this.pokemon.types[1].type.name;
      const color2 = this.typeColors[type2] || '#A8A878';
      this.iconUrl2 = `url('/images/types/${type2}.svg')`;
      this.backgroundGradient = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
    } else {
      this.iconUrl2 = null;
      this.backgroundGradient = `linear-gradient(135deg, ${color1} 0%, #ffffff 100%)`;
    }
  }

  goBack(): void {
    this.location.back();
  }

  private processPokedexDescription(entries: FlavorTextEntry[]): void {
    const portugueseEntry = entries.slice().reverse().find(entry => entry.language.name === 'pt');
    if (portugueseEntry) {
      this.pokedexDescription = portugueseEntry.flavor_text.replace(/[\n\f\r]/g, ' ');
    } else {
      const englishEntry = entries.slice().reverse().find(entry => entry.language.name === 'en');
      this.pokedexDescription = englishEntry ? englishEntry.flavor_text.replace(/[\n\f\r]/g, ' ') : 'Nenhuma descrição encontrada.';
    }
  }

  private processEvolutionChain(chain: EvolutionChainLink): void {
    const evoChain: { name: string }[] = [];
    let currentLink: EvolutionChainLink | undefined = chain;
    while (currentLink) {
      evoChain.push({ name: currentLink.species.name });
      currentLink = currentLink.evolves_to[0];
    }
    const pokemonObservables = evoChain.map(p => this.pokemonService.getPokemonDetails(p.name));
    forkJoin(pokemonObservables).subscribe(pokemonData => {
      this.evolutionChain = pokemonData.map(p => ({
        name: p.name,
        sprite: p.sprites.front_default
      }));
    });
  }

  changeForm(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const url = selectElement.value;
    if (url) {
      this.loadPokemonDetails(url);
    }
  }

  toggleShiny(): void {
    if (this.pokemon) {
      this.isShiny = !this.isShiny;
      const animatedSprites = this.pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated;
      if (this.isShiny) {
        this.displaySprite = animatedSprites?.front_shiny || this.pokemon.sprites.front_shiny;
      } else {
        this.displaySprite = animatedSprites?.front_default || this.pokemon.sprites.front_default;
      }
    }
  }
  
  playPokemonCry(): void {
    if (this.pokemon && this.pokemon.cries.latest) {
      const audio = new Audio(this.pokemon.cries.latest);
      audio.play();
    }
  }

  getStatColor(baseStat: number): string {
    if (baseStat < 50) return '#f44336';
    if (baseStat < 90) return '#FFC107';
    return '#4CAF50';
  }
}