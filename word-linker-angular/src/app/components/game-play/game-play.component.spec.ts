import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GamePlayComponent } from './game-play.component';
import { GameService } from '../../services/game.service';
import { StatsService, GameStats } from '../../services/stats.service';
import { Game } from '../../models/game.model';
import { WordPair } from '../../models/word-pair.model';

describe('GamePlayComponent', () => {
  let component: GamePlayComponent;
  let fixture: ComponentFixture<GamePlayComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let statsService: jasmine.SpyObj<StatsService>;
  let router: jasmine.SpyObj<Router>;
  
  const mockGame: Game = {
    currentWordChain: [],
    maxChainLength: 10,
    score: 0,
    isGameOver: false,
    currentWord: 'water'
  };
  
  const mockStats: GameStats = {
    gamesPlayed: 5,
    highestScore: 150,
    longestChain: 8,
    totalWordsLinked: 25,
    customStartWords: 2,
    randomStartWords: 3
  };
  
  const mockWordPairs: WordPair[] = [
    { firstWord: 'water', secondWord: 'bottle' },
    { firstWord: 'water', secondWord: 'glass' }
  ];
  
  beforeEach(async () => {
    const gameServiceSpy = jasmine.createSpyObj('GameService', 
      ['getGameState', 'getAvailableWordPairs', 'addWordToChain', 'startNewGame']);
    
    const statsServiceSpy = jasmine.createSpyObj('StatsService', ['getStats']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [GamePlayComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: StatsService, useValue: statsServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
    
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    statsService = TestBed.inject(StatsService) as jasmine.SpyObj<StatsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    gameService.getGameState.and.returnValue(new BehaviorSubject<Game>(mockGame));
    gameService.getAvailableWordPairs.and.returnValue(mockWordPairs);
    statsService.getStats.and.returnValue(new BehaviorSubject<GameStats>(mockStats));
    
    fixture = TestBed.createComponent(GamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should subscribe to game state and stats on init', () => {
    expect(gameService.getGameState).toHaveBeenCalled();
    expect(statsService.getStats).toHaveBeenCalled();
    expect(component.game).toEqual(mockGame);
    expect(component.playerStats).toEqual(mockStats);
    expect(component.availableWordPairs).toEqual(mockWordPairs);
  });
  
  it('should redirect to home if game is not initialized', () => {
    const uninitializedGame = { ...mockGame, currentWord: undefined };
    gameService.getGameState.and.returnValue(new BehaviorSubject<Game>(uninitializedGame));
    
    component.ngOnInit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
  
  it('should call addWordToChain when selectWordPair is called', () => {
    const wordPair = mockWordPairs[0];
    gameService.addWordToChain.and.returnValue(true);
    
    component.selectWordPair(wordPair);
    
    expect(gameService.addWordToChain).toHaveBeenCalledWith(wordPair);
  });
  
  it('should call startNewGame when restartGame is called', () => {
    component.restartGame();
    
    expect(gameService.startNewGame).toHaveBeenCalled();
  });
  
  it('should navigate to main menu when goToMenu is called', () => {
    component.goToMenu();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});