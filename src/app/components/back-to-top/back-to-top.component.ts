import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent {
  
  showButton = false;

  // O HostListener "escuta" eventos globais, como o scroll da janela
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Se o usuário rolou mais de 300 pixels para baixo, mostra o botão
    this.showButton = window.scrollY > 300;
  }

  // Função para rolar a página para o topo suavemente
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
