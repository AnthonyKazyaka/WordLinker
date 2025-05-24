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
      // Check if this phrase has been used before (either directly or in reverse)
      const phraseAlreadyUsed = currentGame.currentWordChain.some(existingPair => 
        (existingPair.firstWord.toLowerCase() === wordPair.firstWord.toLowerCase() && 
         existingPair.secondWord.toLowerCase() === wordPair.secondWord.toLowerCase()) || 
        (existingPair.firstWord.toLowerCase() === wordPair.secondWord.toLowerCase() && 
         existingPair.secondWord.toLowerCase() === wordPair.firstWord.toLowerCase())
      );
      
      if (phraseAlreadyUsed) {
        return false; // Don't allow reusing phrases
      }
      
      // Valid next link
      currentGame.currentWordChain.push(wordPair);
      currentGame.currentWord = wordPair.secondWord;
      currentGame.score += 10; // 10 points per word added
      
      // Check if game is over (chain at max length)
      if (currentGame.currentWordChain.length >= currentGame.maxChainLength) {
        currentGame.isGameOver = true;
        currentGame.score += 50; // Bonus for completing the chain
      }
      
      this.gameState.next({ ...currentGame });
      return true;
    }
    
    return false;
  }

  getAvailableWordPairs(): WordPair[] {
    const currentGame = this.gameState.value;
    
    if (!currentGame.currentWord) {
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