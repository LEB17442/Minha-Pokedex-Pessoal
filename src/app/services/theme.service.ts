import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // 'light' ou 'dark'
  private currentTheme = new BehaviorSubject<string>('dark');
  currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    // Ao iniciar, verifica se o usuário já tem um tema salvo no navegador
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme); // Salva a preferência
    this.currentTheme.next(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}