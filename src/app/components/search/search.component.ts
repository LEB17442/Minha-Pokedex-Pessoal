import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, resource } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from "../card/card.component";
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  private http = inject(HttpClient);

  showCard = false;
  pokemonName = "";
  sprite = "";
  id="";
  ptypes: string[] = [];
  pokemonList:any[] = []

  searchForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.http
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20`) // Pegando os 20 primeiros Pokémon
      .subscribe((response: any) => {
        response.results.forEach((element: any) => {
          this.http.get(element.url).subscribe((pokemon: any) => {
            this.pokemonList.push({
              ...pokemon,
              id: `#${String(pokemon.id).padStart(4, '0')}` // Aplicando o formato "#0001"
            });
            console.log(this.pokemonList);
            this.pokemonList.sort((a, b) => a.id.localeCompare(b.id));
          });
        });
      });
  }

  onSubmit(){
    const name = this.searchForm.value.name
    console.log(this.searchForm.value);
    this.http
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .subscribe((result:any)=>{
      console.log(result);
      this.pokemonName = result.name;
      this.sprite = result.sprites.front_default;
      this.id = `#${String(result.id).padStart(4, '0')}`;
      this.ptypes = result.types.map((t: any) => ({ type: { name: t.type.name } }));
      this.showCard = true;
    })
  }


  
}
