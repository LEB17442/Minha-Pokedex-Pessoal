import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Pokemon, PokemonSpecies } from '../interfaces/pokemon.interface';
import { EvolutionChainResponse } from '../interfaces/pokemon.interface'; 
import { PokemonTypeDetails } from '../interfaces/pokemon.interface';
import { PokemonListResponse, PokeApiResponse } from '../interfaces/pokemon.interface'; // Importe as interfaces


// NOVA Interface para a resposta da API de tipo
interface PokeTypeApiResponse {
  pokemon: { pokemon: { url: string } }[];
}

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

public typeColors: { [key: string]: string } = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878' // Cor de normal um pouco ajustada
  };

  private http = inject(HttpClient);
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private allPokemonNames: { name: string, url: string }[] = [];

 getPokemonList(offset: number, limit: number): Observable<PokemonListResponse> {
    return this.http.get<PokeApiResponse>(`${this.apiUrl}?limit=${limit}&offset=${offset}`).pipe(
      switchMap(response => {
        const count = response.count;
        if (!response.results || response.results.length === 0) {
          return of({ count: count, results: [] }); // Retorna um objeto formatado
        }
        const detailRequests = response.results.map(result => this.http.get<Pokemon>(result.url));
        
        return forkJoin(detailRequests).pipe(
          map(pokemonDetails => {
            return { count: count, results: pokemonDetails }; // Retorna o objeto final
          })
        );
      })
    );
  }

  getPokemonDetails(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name}`);
  }

  getTypes(): Observable<any[]> {
    return this.http.get<any>('https://pokeapi.co/api/v2/type').pipe(
      switchMap((response: any) => of(response.results))
    );
  }

  /**
   * Busca Pokémon de um tipo específico.
   */
  getPokemonByType(typeName: string): Observable<any[]> {
    return this.http.get<PokeTypeApiResponse>(`https://pokeapi.co/api/v2/type/${typeName}`).pipe(
      switchMap(response => {
        const pokemonList = response.pokemon.map(p => p.pokemon);
        if (!pokemonList || pokemonList.length === 0) {
          return of([]);
        }
        const detailRequests = pokemonList.map((p: any) => this.http.get<Pokemon>(p.url));
        return forkJoin(detailRequests);
      })
    );
  }
  getPokemonSpecies(url: string):         Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(url);
  }

// (dentro da classe PokemonService)
  getPokemonByUrl(url: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(url);
  }

  getEvolutionChain(url: string): Observable<EvolutionChainResponse> {
    return this.http.get<EvolutionChainResponse>(url);
  }

  getTypeDetails(typeName: string): Observable<PokemonTypeDetails> {
    return this.http.get<PokemonTypeDetails>(`https://pokeapi.co/api/v2/type/${typeName}`);
  }

  getAllPokemonNames(): Observable<{name: string, url: string }[]> {
    if (this.allPokemonNames.length > 0) {
      return of(this.allPokemonNames); // Retorna a lista do cache se já tivermos
    }
    // A API retorna até 2000 resultados com limit=-1
    return this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=2000').pipe(
      map(response => response.results),
      tap(results => this.allPokemonNames = results) // Salva a lista no cache
    );
  }
}
