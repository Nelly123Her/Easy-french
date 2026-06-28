export type Level = 'A0' | 'A1' | 'A2' | 'B1';

export type Category =
  | 'Pronunciation'
  | 'Grammar'
  | 'Vocabulary'
  | 'Expressions'
  | 'Conversations'
  | 'Exercises'
  | 'Review';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'matching';

export interface PronunciationItem {
  french: string;
  english: string;
  pronunciation_hint: string;
  ipa?: string;
}

export interface Example {
  french: string;
  english: string;
}

export interface ConversationLine {
  speaker: string;
  french: string;
  english: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: Difficulty;
  related_lesson_id: string;
  skill: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  level: Level;
  category: Category;
  estimated_minutes: number;
  difficulty: Difficulty;
  objectives: string[];
  explanation: string;
  pronunciation_items: PronunciationItem[];
  examples: Example[];
  native_notes: string[];
  common_mistakes: string[];
  exercises: Exercise[];
  conversation: ConversationLine[];
  summary: string;
  next_lesson_id: string | null;
}

export interface VocabularyItem {
  id: string;
  french: string;
  english: string;
  gender?: 'masculine' | 'feminine' | null;
  part_of_speech: string;
  pronunciation_hint: string;
  ipa?: string;
  example_sentence: string;
  example_translation: string;
  category: string;
  level: Level;
  memory_tip?: string;
}

export interface Expression {
  id: string;
  expression: string;
  literal_translation: string;
  natural_meaning: string;
  pronunciation_hint: string;
  formality: 'Formal' | 'Neutral' | 'Informal' | 'Slang';
  context: string;
  example_dialogue: ConversationLine[];
  warning?: string;
  level: Level;
  category: string;
}
