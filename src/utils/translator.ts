import { QuizItem } from '../types';

/**
 * Translates a single character by reversing its position in the alphabet/number sequences.
 * - 'A' (65) <-> 'Z' (90)
 * - 'a' (97) <-> 'z' (122)
 * - '0' (48) <-> '9' (57)
 */
export function rotateChar(char: string): string {
  const code = char.charCodeAt(0);
  
  // Uppercase A-Z (65 to 90)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(90 - (code - 65));
  }
  
  // Lowercase a-z (97 to 122)
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(122 - (code - 97));
  }
  
  // Digits 0-9 (48 to 57)
  if (code >= 48 && code <= 57) {
    return String.fromCharCode(57 - (code - 48));
  }
  
  return char;
}

/**
 * Translates an entire string using the bi-directional mirror cipher.
 * Because the cipher is symmetric (involution), translating a translation returns the original text.
 */
export function translateText(text: string): string {
  if (!text) return '';
  return text.split('').map(rotateChar).join('');
}

// Full lists for English alphabets and numbers for mapping display
export const ALPHABET_ASC = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const ALPHABET_DESC = 'zyxwvutsrqponmlkjihgfedcba'.split('');

export const NUMBERS_ASC = '0123456789'.split('');
export const NUMBERS_DESC = '9876543210'.split('');

// Preloaded flashcards/quiz words for practicing the mirror language
export const PRACTICE_WORDS: QuizItem[] = [
  {
    id: 'pw-1',
    word: 'hello',
    translation: 'svool',
    hint: 'h -> s, e -> v, l -> o, l -> o, o -> l',
    category: 'Greetings'
  },
  {
    id: 'pw-2',
    word: 'mirror',
    translation: 'nfiili',
    hint: 'm -> n, i -> r, r -> i, r -> i, o -> l, r -> i',
    category: 'Common'
  },
  {
    id: 'pw-3',
    word: 'secret',
    translation: 'hvxivg',
    hint: 's -> h, e -> v, c -> x, r -> i, e -> v, t -> g',
    category: 'Common'
  },
  {
    id: 'pw-4',
    word: 'safe',
    translation: 'hzfv',
    hint: 's -> h, a -> z, f -> u, e -> v',
    category: 'Common'
  },
  {
    id: 'pw-5',
    word: 'offline',
    translation: 'luuormv',
    hint: 'o -> l, f -> u, f -> u, l -> o, i -> r, n -> m, e -> v',
    category: 'Tech'
  },
  {
    id: 'pw-6',
    word: 'agent',
    translation: 'ztvmg',
    hint: 'a -> z, g -> t, e -> v, n -> m, t -> g',
    category: 'Common'
  },
  {
    id: 'pw-7',
    word: 'build',
    translation: 'yfrow',
    hint: 'b -> y, u -> f, i -> r, l -> o, d -> w',
    category: 'Tech'
  },
  {
    id: 'pw-8',
    word: 'code',
    translation: 'xlwv',
    hint: 'c -> x, o -> l, d -> w, e -> v',
    category: 'Tech'
  },
  {
    id: 'pw-9',
    word: '12345',
    translation: '87654',
    hint: 'Remember: 0 -> 9, 1 -> 8, 2 -> 7, 3 -> 6, 4 -> 5, 5 -> 4',
    category: 'Numbers'
  },
  {
    id: 'pw-10',
    word: '987',
    translation: '012',
    hint: '9 -> 0, 8 -> 1, 7 -> 2',
    category: 'Numbers'
  }
];
