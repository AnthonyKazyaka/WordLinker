import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { WordPair } from '../../models/word-pair.model';
import { StatsService, GameStats } from '../../services/stats.service';

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
  playerStats?: GameStats;
  private gameSubscription!: Subscription;
  private statsSubscription!: Subscription;
  
  constructor(
    private gameService: GameService,
    private statsService: StatsService,
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
      if (game.isGameOver) {
        setTimeout(() => {
          alert(`Game Over! Your score: ${game.score}`);
        }, 300);
      }
    });

    // Subscribe to stats
    this.statsSubscription = this.statsService.getStats().subscribe(stats => {
      this.playerStats = stats;
    });
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
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