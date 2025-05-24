import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../models/game.model';
import { WordPair } from '../models/word-pair.model';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private defaultGame: Game = {
    currentWordChain: [],
    maxChainLength: 10,
    score: 0,
    isGameOver: false
  };

  private gameState = new BehaviorSubject<Game>({ ...this.defaultGame });

  constructor(private dictionaryService: DictionaryService) { }

  getGameState(): Observable<Game> {
    return this.gameState.asObservable();
  }

  startNewGame(startWord?: string): void {
    const newGame: Game = { ...this.defaultGame };
    newGame.currentWord = startWord || this.getRandomWord();
    newGame.isGameOver = false;
    newGame.currentWordChain = [];
    newGame.score = 0;
    
    this.gameState.next(newGame);
  }

  addWordToChain(wordPair: WordPair): boolean {
    const currentGame = this.gameState.value;
    
    // Check if this is a valid next pair in the chain
    if (currentGame.currentWord && wordPair.firstWord === currentGame.currentWord.toLowerCase()) {
      // Valid next link
      currentGame.currentWordChain.push(wordPair);
      currentGame.currentWord = wordPair.secondWord;
      currentGame.score += 10; // 10 points per word added
      
      // Check if game is over (chain at max length)
      if (currentGame.currentWordChain.length >= currentGame.maxChainLength) {
        currentGame.isGameOver = true;
        currentGame.score += 50; // Bonus for completing the chain
      }
      
      // Check if no more pairs are available
      const availablePairs = this.dictionaryService.getWordPairsStartingWith(wordPair.secondWord);
      if (availablePairs.length === 0 && !currentGame.isGameOver) {
        // Dead end, but not at max chain length
        currentGame.isGameOver = true;
        if (currentGame.currentWordChain.length >= currentGame.maxChainLength * 0.7) {
          // Partial bonus for getting at least 70% of the way through
          currentGame.score += 20;
        }
      }
      
      this.gameState.next({ ...currentGame });
      return true;
    }
    
    return false;
  }

  getAvailableWordPairs(): WordPair[] {
    const currentGame = this.gameState.value;
    
    if (!currentGame.currentWord || currentGame.isGameOver) {
      return [];
    }
    
    // Get all word pairs that start with the current word
    return this.dictionaryService.getWordPairsStartingWith(currentGame.currentWord);
  }

  endGame(): void {
    const currentGame = this.gameState.value;
    currentGame.isGameOver = true;
    this.gameState.next({ ...currentGame });
  }

  private getRandomWord(): string {
    const wordPairs = this.dictionaryService.getWordPairs();
    if (wordPairs.length === 0) {
      return 'house'; // Default word if dictionary is empty
    }
    
    // Get a random word pair and use its first word
    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    return randomPair.firstWord;
  }
}