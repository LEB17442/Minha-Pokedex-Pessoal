import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importe o RouterLink
import { PokemonService } from '../../services/pokemon.service'; // Importe o serviço


@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() name = "";
  @Input() sprite = "";
  @Input() animatedSprite?: string;
  @Input() id: string | number = "";
  @Input() ptypes: any[] = [];

  private pokemonService = inject(PokemonService); // Injete o serviço
  public typeColors = this.pokemonService.typeColors; // Pegue as cores do serviço

  getGradientStyle(): string {
    if (!this.ptypes || this.ptypes.length === 0) {
      return 'white'; // Cor padrão caso não tenha tipo
    }

    const typeNames = this.ptypes.map(t => t.type.name);

    if (typeNames.length === 1) {
      return this.typeColors[typeNames[0]] || 'white';
    }

    const color1 = this.typeColors[typeNames[0]] || 'white';
    const color2 = this.typeColors[typeNames[1]] || 'white';

    return `linear-gradient(to right, ${color1}, ${color2})`;
  }
}