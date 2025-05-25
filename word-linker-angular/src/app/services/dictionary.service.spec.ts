import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../models/dictionary.model';
import { WordPair } from '../models/word-pair.model';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DictionaryService]
    });
    
    service = TestBed.inject(DictionaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadWordData', () => {
    it('should parse word data correctly', () => {
      const mockData = `
Apple:
  -pie,
  -sauce,
Key:
  -chain,
  House-,
House:
  -key,
  -boat,
  Tree-,
`;
      
      service.loadWordData('assets/data/test-words.txt').subscribe((dictionary: Dictionary) => {
        expect(dictionary.wordPairs.length).toBe(7);
        
        // Check specific pairs
        expect(dictionary.wordPairs).toContain(jasmine.objectContaining({
          firstWord: 'apple',
          secondWord: 'pie'
        }));
        
        expect(dictionary.wordPairs).toContain(jasmine.objectContaining({
          firstWord: 'key',
          secondWord: 'chain'
        }));
        
        expect(dictionary.wordPairs).toContain(jasmine.objectContaining({
          firstWord: 'house',
          secondWord: 'key'
        }));
        
        // Check that the word index is built correctly
        expect(dictionary.wordIndex.has('apple')).toBeTrue();
        expect(dictionary.wordIndex.has('house')).toBeTrue();
        expect(dictionary.wordIndex.has('key')).toBeTrue();
        
        const housePairs = dictionary.wordIndex.get('house');
        expect(housePairs?.length).toBe(4);
      });

      const req = httpMock.expectOne('assets/data/test-words.txt');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle empty file', () => {
      service.loadWordData('assets/data/empty.txt').subscribe((dictionary: Dictionary) => {
        expect(dictionary.wordPairs.length).toBe(0);
        expect(dictionary.wordIndex.size).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/empty.txt');
      req.flush('');
    });
    
    it('should parse words with number prefixes correctly', () => {
      const mockData = `
1234.Water:
  -bottle,
  -glass,
2345.House:
  -key,
  -boat,
`;
      
      service.loadWordData('assets/data/numbered-words.txt').subscribe((dictionary: Dictionary) => {
        // Check that word pairs don't include the number prefix
        expect(dictionary.wordPairs).toContain(jasmine.objectContaining({
          firstWord: 'water', // Not '1234.water'
          secondWord: 'bottle'
        }));
        
        expect(dictionary.wordPairs).toContain(jasmine.objectContaining({
          firstWord: 'house', // Not '2345.house'
          secondWord: 'key'
        }));
        
        // Check that the word index is built correctly without number prefixes
        expect(dictionary.wordIndex.has('water')).toBeTrue();
        expect(dictionary.wordIndex.has('house')).toBeTrue();
        expect(dictionary.wordIndex.has('1234.water')).toBeFalse();
        expect(dictionary.wordIndex.has('2345.house')).toBeFalse();
      });

      const req = httpMock.expectOne('assets/data/numbered-words.txt');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getWordPairsStartingWith', () => {
    it('should return pairs starting with the given word', () => {
      // Setup test data
      const testPairs: WordPair[] = [
        { firstWord: 'dog', secondWord: 'house' },
        { firstWord: 'cat', secondWord: 'food' },
        { firstWord: 'dog', secondWord: 'food' }
      ];
      
      // Manually set the dictionary
      (service as any).dictionary = {
        wordPairs: testPairs,
        wordIndex: new Map<string, WordPair[]>()
      };
      
      const result = service.getWordPairsStartingWith('dog');
      
      expect(result.length).toBe(2);
      expect(result).toContain(jasmine.objectContaining({
        firstWord: 'dog',
        secondWord: 'house'
      }));
      expect(result).toContain(jasmine.objectContaining({
        firstWord: 'dog',
        secondWord: 'food'
      }));
    });

    it('should return empty array for non-existent word', () => {
      // Setup test data
      const testPairs: WordPair[] = [
        { firstWord: 'dog', secondWord: 'house' },
        { firstWord: 'cat', secondWord: 'food' }
      ];
      
      // Manually set the dictionary
      (service as any).dictionary = {
        wordPairs: testPairs,
        wordIndex: new Map<string, WordPair[]>()
      };
      
      const result = service.getWordPairsStartingWith('nonexistent');
      
      expect(result.length).toBe(0);
    });
  });

  describe('getWordPairsEndingWith', () => {
    it('should return pairs ending with the given word', () => {
      // Setup test data
      const testPairs: WordPair[] = [
        { firstWord: 'dog', secondWord: 'house' },
        { firstWord: 'tree', secondWord: 'house' },
        { firstWord: 'dog', secondWord: 'food' }
      ];
      
      // Manually set the dictionary
      (service as any).dictionary = {
        wordPairs: testPairs,
        wordIndex: new Map<string, WordPair[]>()
      };
      
      const result = service.getWordPairsEndingWith('house');
      
      expect(result.length).toBe(2);
      expect(result).toContain(jasmine.objectContaining({
        firstWord: 'dog',
        secondWord: 'house'
      }));
      expect(result).toContain(jasmine.objectContaining({
        firstWord: 'tree',
        secondWord: 'house'
      }));
    });
  });

  describe('getRelatedPairs', () => {
    it('should return all pairs related to the given word', () => {
      // Setup test data
      const dogPairs: WordPair[] = [
        { firstWord: 'dog', secondWord: 'house' },
        { firstWord: 'dog', secondWord: 'food' },
        { firstWord: 'cat', secondWord: 'dog' }
      ];
      
      const wordIndex = new Map<string, WordPair[]>();
      wordIndex.set('dog', dogPairs);
      
      // Manually set the dictionary
      (service as any).dictionary = {
        wordPairs: [],
        wordIndex: wordIndex
      };
      
      const result = service.getRelatedPairs('dog');
      
      expect(result.length).toBe(3);
      expect(result).toEqual(dogPairs);
    });
  });
});