import { WordPair } from './word-pair.model';

export interface Dictionary {
  wordPairs: WordPair[];
  wordIndex: Map<string, WordPair[]>;
}