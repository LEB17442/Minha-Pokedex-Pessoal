import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pokemon/:name', component: PokemonDetailComponent },
    { path: '**', redirectTo: '' } // Redireciona para a home se a rota não existir
];