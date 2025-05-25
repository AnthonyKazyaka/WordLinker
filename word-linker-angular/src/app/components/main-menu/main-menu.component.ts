import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DictionaryService } from '../../services/dictionary.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  dictionaryLoaded = false;
  startWord = '';
  
  constructor(
    private dictionaryService: DictionaryService,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load dictionary from both word files
    const wordFiles = [
      'assets/data/words-to-link.txt',
      'assets/data/chain-reaction-words.txt'
    ];
    
    // Load the first file, then the second
    this.dictionaryService.loadWordData(wordFiles[0])
      .subscribe({
        next: () => {
          // After the first file is loaded, load the second file
          this.dictionaryService.loadWordData(wordFiles[1])
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

  startGame(): void {
    this.gameService.startNewGame(this.startWord);
    this.router.navigate(['/game']);
  }
}