export interface TranslationItem {
  id: string;
  original: string;
  mirrored: string;
  timestamp: number;
  label?: string;
}

export interface QuizItem {
  id: string;
  word: string;
  translation: string;
  hint: string;
  category: string;
}

export interface QuizState {
  score: number;
  totalAnswered: number;
  currentIndex: number;
  isPlaying: boolean;
  userAnswer: string;
  feedback: 'correct' | 'incorrect' | 'neutral';
}
