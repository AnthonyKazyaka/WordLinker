import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GameStats {
  gamesPlayed: number;
  highestScore: number;
  longestChain: number;
  totalWordsLinked: number;
  customStartWords: number;
  randomStartWords: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly STORAGE_KEY = 'word-linker-stats';
  private stats: GameStats;
  private statsSubject: BehaviorSubject<GameStats>;

  constructor() {
    // Initialize with default values or load from localStorage
    this.stats = this.loadStats();
    this.statsSubject = new BehaviorSubject<GameStats>(this.stats);
  }

  getStats(): Observable<GameStats> {
    return this.statsSubject.asObservable();
  }

  recordGamePlayed(score: number, chainLength: number, usedCustomStartWord: boolean): void {
    // Update stats
    this.stats.gamesPlayed++;
    this.stats.highestScore = Math.max(this.stats.highestScore, score);
    this.stats.longestChain = Math.max(this.stats.longestChain, chainLength);
    this.stats.totalWordsLinked += chainLength;
    
    if (usedCustomStartWord) {
      this.stats.customStartWords++;
    } else {
      this.stats.randomStartWords++;
    }
    
    // Save to localStorage
    this.saveStats();
    
    // Update the observable
    this.statsSubject.next({...this.stats});
  }

  resetStats(): void {
    this.stats = this.getDefaultStats();
    this.saveStats();
    this.statsSubject.next({...this.stats});
  }

  private loadStats(): GameStats {
    try {
      const storedStats = localStorage.getItem(this.STORAGE_KEY);
      if (storedStats) {
        return JSON.parse(storedStats);
      }
    } catch (error) {
      console.error('Error loading stats from localStorage:', error);
    }
    
    return this.getDefaultStats();
  }

  private saveStats(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Error saving stats to localStorage:', error);
    }
  }

  private getDefaultStats(): GameStats {
    return {
      gamesPlayed: 0,
      highestScore: 0,
      longestChain: 0,
      totalWordsLinked: 0,
      customStartWords: 0,
      randomStartWords: 0
    };
  }
}