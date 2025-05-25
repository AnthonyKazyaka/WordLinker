import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DictionaryService } from '../../services/dictionary.service';
import { GameService } from '../../services/game.service';
import { StatsService, GameStats } from '../../services/stats.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  dictionaryLoaded = false;
  startWord = '';
  gameStats?: GameStats;
  private statsSubscription!: Subscription;
  
  constructor(
    private dictionaryService: DictionaryService,
    private gameService: GameService,
    private statsService: StatsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load the enhanced dictionary file
    const enhancedWordsFile = 'assets/data/EnhancedWords.txt';
    
    // Load the enhanced dictionary file
    this.dictionaryService.loadWordData(enhancedWordsFile)
      .subscribe({
        next: () => {
          this.dictionaryLoaded = true;
        },
        error: (error) => {
          console.error('Failed to load enhanced dictionary file:', error);
          
          // Fallback to the original files if enhanced file fails to load
          const originalWordFiles = [
            'assets/data/words-to-link.txt',
            'assets/data/chain-reaction-words.txt'
          ];
          
          // Load the first file, then the second
          this.dictionaryService.loadWordData(originalWordFiles[0])
            .subscribe({
              next: () => {
                // After the first file is loaded, load the second file
                this.dictionaryService.loadWordData(originalWordFiles[1])
                  .subscribe({
                    next: () => {
                      this.dictionaryLoaded = true;
                    },
                    error: (error) => {
                      console.error('Failed to load second dictionary file:', error);
                      // Still mark as loaded if at least the first file was successful
                      this.dictionaryLoaded = true;
                    }
                  });
              },
              error: (error) => {
                console.error('Failed to load first dictionary file:', error);
              }
            });
        }
      });
      
    // Subscribe to stats
    this.statsSubscription = this.statsService.getStats().subscribe(stats => {
      this.gameStats = stats;
    });
  }
  
  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  startGame(): void {
    this.gameService.startNewGame(this.startWord);
    this.router.navigate(['/game']);
  }
  
  resetStats(): void {
    if (confirm('Are you sure you want to reset all game statistics?')) {
      this.statsService.resetStats();
    }
  }
}