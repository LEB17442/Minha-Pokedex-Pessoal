import { CommonModule } from '@angular/common'; // Garanta que esta importação está presente
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { Pokemon, PokemonType } from '../../interfaces/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';
import { CardComponent } from "../card/card.component";

@Component({
  selector: 'app-search',
  standalone: true,
  // A linha 'imports' é a mais importante aqui. Verifique se está exatamente assim:
 imports: [
    CommonModule, 
    ReactiveFormsModule, 
    CardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  
  private pokemonService = inject(PokemonService);
  public typeColors = this.pokemonService.typeColors;
  
  showCard = false;
  pokemonName = "";
  sprite = "";
  animatedSprite?: string;
  id: string | number = "";
  ptypes: PokemonType[] = [];
  pokemonList: Pokemon[] = [];
  isLoading = false;
  offset = 0;
  limit = 20;
  
  showFilterOverlay = false;
  allTypes: any[] = [];
  selectedTypes: string[] = [];

  searchForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadPokemon();
    this.pokemonService.getTypes().subscribe(types => {
      this.allTypes = types.filter(t => t.name !== 'unknown' && t.name !== 'shadow');
    });
  }

  loadPokemon(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList(this.offset, this.limit)
      .subscribe((pokemonDetails: Pokemon[]) => {
        const newPokemon = pokemonDetails.map(pokemon => ({
          ...pokemon,
          id: `#${String(pokemon.id).padStart(4, '0')}`,
          animatedSprite: pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemon.sprites.front_default
        }));
        this.pokemonList = [...this.pokemonList, ...newPokemon];
        console.log('Pokémon List Updated:', this.pokemonList);
        this.pokemonList.sort((a, b) => (a.id as string).localeCompare(b.id as string));
        this.isLoading = false;
        this.offset += this.limit;
      });
  }
  
  loadMore(): void {
    if (this.selectedTypes.length > 0) return;
    this.loadPokemon();
  }

  toggleFilterOverlay(): void {
    this.showFilterOverlay = !this.showFilterOverlay;
  }

  isTypeSelected(typeName: string): boolean {
    return this.selectedTypes.includes(typeName);
  }

  toggleTypeFilter(typeName: string): void {
    const index = this.selectedTypes.indexOf(typeName);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else if (this.selectedTypes.length < 2) {
      this.selectedTypes.push(typeName);
    }
  }

  clearFilters(): void {
    this.selectedTypes = [];
    this.applyFilters();
  }

  applyFilters(): void {
    this.pokemonList = [];
    this.offset = 0;
    this.showCard = false;
    this.toggleFilterOverlay();

    if (this.selectedTypes.length === 0) {
      this.loadPokemon();
      return;
    }

    this.isLoading = true;

    if (this.selectedTypes.length === 1) {
      this.pokemonService.getPokemonByType(this.selectedTypes[0]).subscribe(this.handlePokemonListResponse);
    } else {
      forkJoin({
        list1: this.pokemonService.getPokemonByType(this.selectedTypes[0]),
        list2: this.pokemonService.getPokemonByType(this.selectedTypes[1])
      }).subscribe(({ list1, list2 }) => {
        const names1 = new Set(list1.map(p => p.name));
        const intersection = list2.filter(p => names1.has(p.name));
        this.handlePokemonListResponse(intersection);
      });
    }
  }

  private handlePokemonListResponse = (pokemonDetails: Pokemon[]) => {
    const newPokemon = pokemonDetails.map(pokemon => ({
      ...pokemon,
      id: `#${String(pokemon.id).padStart(4, '0')}`,
      animatedSprite: pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemon.sprites.front_default
    }));
    this.pokemonList = newPokemon;
    this.pokemonList.sort((a, b) => (a.id as string).localeCompare(b.id as string));
    this.isLoading = false;
  }

   onSubmit() {
    const name = this.searchForm.value.name?.toLowerCase();
    if (!name) {
      this.showCard = false;
      return;
    }

    this.isLoading = true;
    this.showCard = false;
    this.pokemonService.getPokemonDetails(name)
      .subscribe({
        next: (result: Pokemon) => {
          this.pokemonName = result.name;
          this.sprite = result.sprites.front_default;
          // GARANTE QUE O SPRITE ANIMADO SEJA ATRIBUÍDO CORRETAMENTE NA BUSCA
          this.animatedSprite = result.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || result.sprites.front_default;
          this.id = `#${String(result.id).padStart(4, '0')}`;
          this.ptypes = result.types;
          this.showCard = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Erro ao buscar o Pokémon:", error);
          this.isLoading = false;
          alert('Pokémon não encontrado!');
        }
      });
  }
}