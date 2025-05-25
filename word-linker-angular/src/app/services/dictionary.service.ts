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
      tap(dictionary => {
        // Merge with existing dictionary instead of replacing
        dictionary.wordPairs.forEach(pair => {
          // Only add if not already in the dictionary
          const exists = this.dictionary.wordPairs.some(
            existingPair => 
              existingPair.firstWord === pair.firstWord && 
              existingPair.secondWord === pair.secondWord
          );
          
          if (!exists) {
            this.dictionary.wordPairs.push(pair);
            
            // Update the index
            if (!this.dictionary.wordIndex.has(pair.firstWord)) {
              this.dictionary.wordIndex.set(pair.firstWord, []);
            }
            this.dictionary.wordIndex.get(pair.firstWord)!.push(pair);
            
            if (!this.dictionary.wordIndex.has(pair.secondWord)) {
              this.dictionary.wordIndex.set(pair.secondWord, []);
            }
            this.dictionary.wordIndex.get(pair.secondWord)!.push(pair);
          }
        });
      }),
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
          
          // Filter out suffixes like -ing, -er, -ed, etc.
          if (this.isValidWordPair(currentWord, secondWord)) {
            pair = { firstWord: currentWord, secondWord };
          }
        } 
        // Case: "word-,"
        else if (trimmedLine.endsWith('-,')) {
          // Format: "firstWord-," -> second word is the current word
          const firstWord = trimmedLine.substring(0, trimmedLine.length - 2).toLowerCase();
          
          // Filter out suffixes
          if (this.isValidWordPair(firstWord, currentWord)) {
            pair = { firstWord, secondWord: currentWord };
          }
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

  // Helper method to filter out invalid word pairs
  private isValidWordPair(firstWord: string, secondWord: string): boolean {
    // Filter out suffixes (words with less than 3 characters)
    if (secondWord.length < 3 || firstWord.length < 3) {
      return false;
    }
    
    // List of common suffixes to exclude
    const commonSuffixes = ['ing', 'er', 'ed', 'es', 'ly', 'ment', 'able', 'ible', 'ful', 'tion'];
    
    // Check if the second word is just a suffix
    for (const suffix of commonSuffixes) {
      if (secondWord === suffix) {
        return false;
      }
    }
    
    return true;
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