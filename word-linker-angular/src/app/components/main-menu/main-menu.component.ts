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
    // Load dictionary from assets
    this.dictionaryService.loadWordData('assets/data/words-to-link.txt')
      .subscribe({
        next: () => {
          this.dictionaryLoaded = true;
        },
        error: (error) => {
          console.error('Failed to load dictionary:', error);
        }
      });
  }

  startGame(): void {
    this.gameService.startNewGame(this.startWord);
    this.router.navigate(['/game']);
  }
}