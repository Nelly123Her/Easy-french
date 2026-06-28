import { lessons } from '@/data/lessons';
import { vocabulary } from '@/data/vocabulary';
import { expressions } from '@/data/expressions';
import type { Lesson, VocabularyItem, Expression } from '@/types';

export interface SearchResults {
  lessons: Lesson[];
  grammarTopics: Lesson[];
  vocabulary: VocabularyItem[];
  expressions: Expression[];
  total: number;
}

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function matches(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query));
}

export function search(query: string): SearchResults {
  const q = query.trim();
  if (q.length < 2) {
    return { lessons: [], grammarTopics: [], vocabulary: [], expressions: [], total: 0 };
  }

  const matchedLessons = lessons.filter(
    (l) =>
      l.category !== 'Grammar' &&
      (matches(l.title, q) ||
        matches(l.explanation, q) ||
        l.objectives.some((o) => matches(o, q)) ||
        l.native_notes.some((n) => matches(n, q)))
  );

  const matchedGrammar = lessons.filter(
    (l) =>
      l.category === 'Grammar' &&
      (matches(l.title, q) ||
        matches(l.explanation, q) ||
        l.objectives.some((o) => matches(o, q)))
  );

  const matchedVocab = vocabulary.filter(
    (v) =>
      matches(v.french, q) ||
      matches(v.english, q) ||
      matches(v.example_sentence, q) ||
      (v.memory_tip ? matches(v.memory_tip, q) : false) ||
      matches(v.category, q)
  );

  const matchedExpressions = expressions.filter(
    (e) =>
      matches(e.expression, q) ||
      matches(e.natural_meaning, q) ||
      matches(e.literal_translation, q) ||
      matches(e.context, q) ||
      matches(e.category, q)
  );

  const total =
    matchedLessons.length +
    matchedGrammar.length +
    matchedVocab.length +
    matchedExpressions.length;

  return {
    lessons: matchedLessons,
    grammarTopics: matchedGrammar,
    vocabulary: matchedVocab,
    expressions: matchedExpressions,
    total,
  };
}
