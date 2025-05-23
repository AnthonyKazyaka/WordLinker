import { Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { GamePlayComponent } from './components/game-play/game-play.component';

export const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'game', component: GamePlayComponent },
  { path: '**', redirectTo: '' }
];
