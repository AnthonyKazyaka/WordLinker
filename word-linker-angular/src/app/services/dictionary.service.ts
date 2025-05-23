import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { WordPair } from '../models/word-pair.model';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionary: Dictionary = {
    wordPairs: [],
    wordIndex: new Map<string, WordPair[]>()
  };

  constructor(private http: HttpClient) { }

  loadWordData(filePath: string): Observable<Dictionary> {
    return this.http.get(filePath, { responseType: 'text' }).pipe(
      map(text => this.parseWordData(text)),
      tap(dictionary => this.dictionary = dictionary),
      catchError(error => {
        console.error('Error loading word data:', error);
        return of(this.dictionary);
      })
    );
  }

  private parseWordData(text: string): Dictionary {
    const lines = text.split('\n');
    const wordPairs: WordPair[] = [];
    const wordIndex = new Map<string, WordPair[]>();
    
    let currentWord = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // If line ends with colon, it's a new main word
      if (trimmedLine.endsWith(':')) {
        currentWord = trimmedLine.substring(0, trimmedLine.length - 1).toLowerCase();
      } else if (trimmedLine) {
        let pair: WordPair | null = null;
        
        // Case: "-word,"
        if (trimmedLine.startsWith('-')) {
          // Format: "-secondWord," -> first word is the current word
          const secondWord = trimmedLine.substring(1, trimmedLine.length - 1).toLowerCase();
          pair = { firstWord: currentWord, secondWord };
        } 
        // Case: "word-,"
        else if (trimmedLine.endsWith('-,')) {
          // Format: "firstWord-," -> second word is the current word
          const firstWord = trimmedLine.substring(0, trimmedLine.length - 2).toLowerCase();
          pair = { firstWord, secondWord: currentWord };
        }
        
        if (pair) {
          wordPairs.push(pair);
          
          // Index by first word
          if (!wordIndex.has(pair.firstWord)) {
            wordIndex.set(pair.firstWord, []);
          }
          wordIndex.get(pair.firstWord)!.push(pair);
          
          // Index by second word
          if (!wordIndex.has(pair.secondWord)) {
            wordIndex.set(pair.secondWord, []);
          }
          wordIndex.get(pair.secondWord)!.push(pair);
        }
      }
    }
    
    return { wordPairs, wordIndex };
  }

  getDictionary(): Dictionary {
    return this.dictionary;
  }

  getWordPairs(): WordPair[] {
    return this.dictionary.wordPairs;
  }

  getWordPairsStartingWith(word: string): WordPair[] {
    return this.dictionary.wordPairs.filter(pair => pair.firstWord === word.toLowerCase());
  }

  getWordPairsEndingWith(word: string): WordPair[] {
    return this.dictionary.wordPairs.filter(pair => pair.secondWord === word.toLowerCase());
  }

  getRelatedPairs(word: string): WordPair[] {
    return this.dictionary.wordIndex.get(word.toLowerCase()) || [];
  }
}