import { WordPair } from './word-pair.model';

export interface Game {
  currentWordChain: WordPair[];
  maxChainLength: number;
  score: number;
  isGameOver: boolean;
  currentWord?: string;
}