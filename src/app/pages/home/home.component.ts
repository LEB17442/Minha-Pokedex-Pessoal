import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SearchComponent } from '../../components/search/search.component';
import { BackToTopComponent } from '../../components/back-to-top/back-to-top.component'; // Importe


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SearchComponent, BackToTopComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}