import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() name = "";
  @Input() sprite = "";
  @Input() id = "";
  @Input() ptypes: any[] = [];
}
