import { Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { GamePlayComponent } from './components/game-play/game-play.component';

export const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'game', component: GamePlayComponent },
  { path: '**', redirectTo: '' }
];

// Automatically handle GitHub Pages URL structure
// This script will be executed when the app initializes
const path = localStorage.getItem('path') || sessionStorage.getItem('redirect');
if (path) {
  localStorage.removeItem('path');
  sessionStorage.removeItem('redirect');
  
  // Strip the base path for Angular routes to work correctly
  const strippedPath = path.replace(/^\/WordLinker/, '');
  if (strippedPath !== path) {
    window.history.replaceState(null, '', strippedPath);
  }
}
