import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  
  // A variável 'message$' agora é um Observable que "assiste" às mudanças no serviço
  message$: Observable<string | null> = this.notificationService.getMessage();
}