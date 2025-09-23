import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private message$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // Expõe a mensagem como um Observable para que os componentes possam "escutar"
  public getMessage(): Observable<string | null> {
    return this.message$.asObservable();
  }

  // Método para mostrar uma nova notificação
  public show(message: string): void {
    this.message$.next(message);

    // Esconde a mensagem automaticamente após 3 segundos
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  // Método para esconder a notificação
  public hide(): void {
    this.message$.next(null);
  }
}