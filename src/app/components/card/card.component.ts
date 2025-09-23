import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importe o RouterLink
import { PokemonService } from '../../services/pokemon.service'; // Importe o serviço
import { ThemeService } from '../../services/theme.service'; // 1. Importe o ThemeService
import { Observable } from 'rxjs'; // Importe o Observable


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
  private themeService = inject(ThemeService); // 2. Injete o ThemeService
  public typeColors = this.pokemonService.typeColors; // Pegue as cores do serviço

  public currentTheme$: Observable<string> = this.themeService.currentTheme$;

  getGradientStyle(currentTheme: string | null): string {
    if (!this.ptypes || this.ptypes.length === 0) {
      return currentTheme === 'dark' ? '#4A5568' : '#FFFFFF';
    }

    const color1 = this.typeColors[this.ptypes[0].type.name] || '#A8A878';
    
    // Se for o tema escuro, usa o estilo "aura"
    if (currentTheme === 'dark') {
      const darkCardBg = '#2d3748';
      if (this.ptypes.length === 1) {
        return `radial-gradient(circle at 0% 0%, ${color1}60 0%, ${darkCardBg} 60%)`;
      }
      const color2 = this.typeColors[this.ptypes[1].type.name] || '#A8A878';
      return `radial-gradient(circle at 100% 100%, ${color2}60 0%, transparent 50%), radial-gradient(circle at 0% 0%, ${color1}40 0%, ${darkCardBg} 70%)`;
    }

    // Se for o tema claro, usa o estilo de gradiente vibrante original
    if (this.ptypes.length === 1) {
      return color1;
    }
    const color2 = this.ptypes.length > 1 ? this.typeColors[this.ptypes[1].type.name] || '#A8A878' : color1;
    return `linear-gradient(to right, ${color1}, ${color2})`;
  }
}