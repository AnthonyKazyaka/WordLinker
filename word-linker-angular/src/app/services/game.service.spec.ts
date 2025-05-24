import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { DictionaryService } from './dictionary.service';
import { WordPair } from '../models/word-pair.model';
import { of } from 'rxjs';

describe('GameService', () => {
  let gameService: GameService;
  let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DictionaryService', [
      'getWordPairs',
      'getWordPairsStartingWith'
    ]);
    
    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: DictionaryService, useValue: spy }
      ]
    });
    
    gameService = TestBed.inject(GameService);
    dictionaryServiceSpy = TestBed.inject(DictionaryService) as jasmine.SpyObj<DictionaryService>;
  });

  it('should be created', () => {
    expect(gameService).toBeTruthy();
  });

  describe('startNewGame', () => {
    it('should initialize a new game with the specified start word', () => {
      const startWord = 'house';
      
      gameService.startNewGame(startWord);
      
      gameService.getGameState().subscribe(game => {
        expect(game.currentWord).toBe(startWord);
        expect(game.currentWordChain).toEqual([]);
        expect(game.score).toBe(0);
        expect(game.isGameOver).toBe(false);
      });
    });

    it('should initialize a new game with a random word if no word is provided', () => {
      const mockWordPairs: WordPair[] = [
        { firstWord: 'cat', secondWord: 'food' },
        { firstWord: 'dog', secondWord: 'house' }
      ];
      
      dictionaryServiceSpy.getWordPairs.and.returnValue(mockWordPairs);
      
      gameService.startNewGame();
      
      gameService.getGameState().subscribe(game => {
        expect(game.currentWord).toBeTruthy();
        if (game.currentWord) {
          expect(['cat', 'dog']).toContain(game.currentWord);
        }
        expect(game.currentWordChain).toEqual([]);
        expect(game.score).toBe(0);
        expect(game.isGameOver).toBe(false);
      });
    });
  });

  describe('addWordToChain', () => {
    it('should add a valid word pair to the chain and update score', () => {
      const startWord = 'dog';
      const validPair: WordPair = { firstWord: 'dog', secondWord: 'house' };
      
      // Mock available pairs to avoid ending game
      dictionaryServiceSpy.getWordPairsStartingWith.and.returnValue([{ firstWord: 'house', secondWord: 'boat' }]);
      
      gameService.startNewGame(startWord);
      const result = gameService.addWordToChain(validPair);
      
      expect(result).toBe(true);
      
      gameService.getGameState().subscribe(game => {
        expect(game.currentWord).toBe('house');
        expect(game.currentWordChain.length).toBe(1);
        expect(game.currentWordChain[0]).toEqual(validPair);
        expect(game.score).toBe(10);
        expect(game.isGameOver).toBe(false);
      });
    });

    it('should reject an invalid word pair', () => {
      const startWord = 'dog';
      const invalidPair: WordPair = { firstWord: 'cat', secondWord: 'food' };
      
      gameService.startNewGame(startWord);
      const result = gameService.addWordToChain(invalidPair);
      
      expect(result).toBe(false);
      
      gameService.getGameState().subscribe(game => {
        expect(game.currentWord).toBe('dog');
        expect(game.currentWordChain.length).toBe(0);
        expect(game.score).toBe(0);
      });
    });

    it('should end the game when max chain length is reached', () => {
      const startWord = 'house';
      const validPair: WordPair = { firstWord: 'house', secondWord: 'key' };
      
      dictionaryServiceSpy.getWordPairsStartingWith.and.returnValue([]);
      
      gameService.startNewGame(startWord);
      
      // Set max chain length to 1 for testing
      const gameState = (gameService as any).gameState.value;
      gameState.maxChainLength = 1;
      (gameService as any).gameState.next(gameState);
      
      const result = gameService.addWordToChain(validPair);
      
      expect(result).toBe(true);
      
      gameService.getGameState().subscribe(game => {
        expect(game.isGameOver).toBe(true);
        expect(game.score).toBe(60); // 10 for the word + 50 bonus
      });
    });
    
    it('should end the game when no more pairs are available', () => {
      const startWord = 'house';
      const validPair: WordPair = { firstWord: 'house', secondWord: 'key' };
      
      // No pairs available for 'key'
      dictionaryServiceSpy.getWordPairsStartingWith.and.returnValue([]);
      
      gameService.startNewGame(startWord);
      const result = gameService.addWordToChain(validPair);
      
      expect(result).toBe(true);
      
      gameService.getGameState().subscribe(game => {
        expect(game.isGameOver).toBe(true);
        expect(game.score).toBe(10); // 10 for the word, no bonus for short chain
      });
    });
    
    it('should give partial bonus when reaching 70% of max chain with no more pairs', () => {
      const startWord = 'first';
      const validPair: WordPair = { firstWord: 'first', secondWord: 'second' };
      
      // No pairs available for the next step
      dictionaryServiceSpy.getWordPairsStartingWith.and.returnValue([]);
      
      gameService.startNewGame(startWord);
      
      // Manually set up the game state
      const gameState = (gameService as any).gameState.value;
      gameState.maxChainLength = 10;
      gameState.currentWordChain = Array(6).fill(validPair); // 6 is 60% of 10, adding one more will be 70%
      gameState.score = 60; // 10 points per word
      (gameService as any).gameState.next(gameState);
      
      const result = gameService.addWordToChain(validPair);
      
      expect(result).toBe(true);
      
      gameService.getGameState().subscribe(game => {
        expect(game.isGameOver).toBe(true);
        expect(game.score).toBe(90); // 70 for 7 words + 20 partial bonus
      });
    });
  });

  describe('getAvailableWordPairs', () => {
    it('should return word pairs starting with current word', () => {
      const currentWord = 'house';
      const availablePairs: WordPair[] = [
        { firstWord: 'house', secondWord: 'key' },
        { firstWord: 'house', secondWord: 'boat' }
      ];
      
      dictionaryServiceSpy.getWordPairsStartingWith.and.returnValue(availablePairs);
      
      gameService.startNewGame(currentWord);
      const result = gameService.getAvailableWordPairs();
      
      expect(dictionaryServiceSpy.getWordPairsStartingWith).toHaveBeenCalledWith(currentWord);
      expect(result).toEqual(availablePairs);
    });

    it('should return empty array if no current word', () => {
      // Reset game state with no current word
      const emptyGame = (gameService as any).defaultGame;
      (gameService as any).gameState.next({...emptyGame});
      
      const result = gameService.getAvailableWordPairs();
      
      expect(result).toEqual([]);
      expect(dictionaryServiceSpy.getWordPairsStartingWith).not.toHaveBeenCalled();
    });
    
    it('should return empty array if game is over', () => {
      gameService.startNewGame('test');
      gameService.endGame();
      
      const result = gameService.getAvailableWordPairs();
      
      expect(result).toEqual([]);
      expect(dictionaryServiceSpy.getWordPairsStartingWith).not.toHaveBeenCalled();
    });
  });

  describe('endGame', () => {
    it('should set isGameOver to true', () => {
      gameService.startNewGame('test');
      gameService.endGame();
      
      gameService.getGameState().subscribe(game => {
        expect(game.isGameOver).toBe(true);
      });
    });
  });
});