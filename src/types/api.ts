export type ActivityType =
  | "WORDLE"
  | "WORD_SEARCH";

export type Difficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export type WordEntry = {
  id: string;
  phoneme: string;
  english: string;
  hint: string | null;
  wordListId: string;
  createdAt: string;
  updatedAt: string;
};

export type WordList = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  words: WordEntry[];
};

export type ActivityWord = {
  activityId: string;
  wordEntryId: string;
  position: number | null;
  isAnswer: boolean;
  wordEntry: WordEntry;
};

export type Activity = {
  id: string;
  name: string;
  description: string | null;
  type: ActivityType;
  difficulty: Difficulty;
  maxGuesses: number | null;
  gridSize: number | null;
  settings: unknown;
  wordListId: string | null;
  wordList: WordList | null;
  words: ActivityWord[];
  createdAt: string;
  updatedAt: string;
};

export type CreateWordListInput = {
  name: string;
  description?: string | null;
};

export type UpdateWordListInput = {
  name?: string;
  description?: string | null;
};

export type CreateWordInput = {
  phoneme: string;
  english: string;
  hint?: string | null;
  wordListId: string;
};

export type UpdateWordInput = {
  phoneme?: string;
  english?: string;
  hint?: string | null;
  wordListId?: string;
};

export type CreateActivityInput = {
  name: string;
  description?: string | null;
  type: ActivityType;
  difficulty?: Difficulty;
  maxGuesses?: number;
  gridSize?: number;
  wordListId?: string | null;
  settings?: unknown;
};

export type UpdateActivityInput = {
  name?: string;
  description?: string | null;
  type?: ActivityType;
  difficulty?: Difficulty;
  maxGuesses?: number | null;
  gridSize?: number | null;
  wordListId?: string | null;
  settings?: unknown;
};