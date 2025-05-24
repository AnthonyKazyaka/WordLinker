import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { WordPair } from '../../models/word-pair.model';

@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit, OnDestroy {
  game!: Game;
  availableWordPairs: WordPair[] = [];
  private gameSubscription!: Subscription;
  
  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameSubscription = this.gameService.getGameState().subscribe(game => {
      this.game = game;
      
      // If game is not initialized, redirect to menu
      if (!game.currentWord) {
        this.router.navigate(['/']);
        return;
      }
      
      // Update available word pairs
      this.availableWordPairs = this.gameService.getAvailableWordPairs();
      
      // Check for game over
      if (game.isGameOver && this.availableWordPairs.length === 0) {
        // End game if no more pairs are available
        this.gameService.endGame();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  selectWordPair(wordPair: WordPair): void {
    const success = this.gameService.addWordToChain(wordPair);
    
    if (!success) {
      alert('That word pair does not connect to the current chain!');
    }
  }

  restartGame(): void {
    this.gameService.startNewGame();
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }
}