import type { VocabularyItem, Expression, Exercise } from '@/types';
import type { SoundExample } from '@/data/pronunciation';
import { vocabulary } from '@/data/vocabulary';
import { expressions } from '@/data/expressions';
import { exercises } from '@/data/exercises';
import { soundCategories } from '@/data/pronunciation';
import {
  getVocabLastSeen,
  getAllExerciseScores,
  getSavedVocabIds,
  getSavedExpressionIds,
} from '@/lib/progress';

export type SessionItem =
  | { kind: 'vocabulary'; item: VocabularyItem }
  | { kind: 'pronunciation'; example: SoundExample; categoryTitle: string }
  | { kind: 'exercise'; exercise: Exercise }
  | { kind: 'expression'; expression: Expression }
  | { kind: 'review_vocab'; item: VocabularyItem }
  | { kind: 'review_expression'; expression: Expression };

export type SessionDuration = 5 | 10 | 15;

export function buildSession(durationMinutes: SessionDuration): SessionItem[] {
  const multiplier = durationMinutes / 5; // 1, 2, or 3
  const items: SessionItem[] = [];

  // Vocabulary: prioritise least-recently seen / never seen
  const lastSeen = getVocabLastSeen();
  const vocabSorted = [...vocabulary].sort(
    (a, b) => (lastSeen[a.id] ?? 0) - (lastSeen[b.id] ?? 0)
  );
  for (let i = 0; i < 3 * multiplier; i++) {
    if (vocabSorted[i]) items.push({ kind: 'vocabulary', item: vocabSorted[i] });
  }

  // Pronunciation: cycle through sound category examples
  const pronPool = soundCategories.flatMap(cat =>
    cat.examples.map(ex => ({ example: ex, categoryTitle: cat.title }))
  );
  for (let i = 0; i < multiplier; i++) {
    const entry = pronPool[i % pronPool.length];
    if (entry) items.push({ kind: 'pronunciation', example: entry.example, categoryTitle: entry.categoryTitle });
  }

  // Grammar exercises: untried first (-1 score), then lowest score
  const scores = getAllExerciseScores();
  const mcExercises = exercises.filter(e => e.type === 'multiple_choice');
  const sortedMC = [...mcExercises].sort(
    (a, b) => (scores[a.id]?.score ?? -1) - (scores[b.id]?.score ?? -1)
  );
  for (let i = 0; i < multiplier; i++) {
    if (sortedMC[i]) items.push({ kind: 'exercise', exercise: sortedMC[i] });
  }

  // Expressions: cycle through list
  for (let i = 0; i < multiplier; i++) {
    const expr = expressions[i % expressions.length];
    if (expr) items.push({ kind: 'expression', expression: expr });
  }

  // Review: saved vocab and expressions
  const savedVocabIds = getSavedVocabIds();
  const savedExprIds = getSavedExpressionIds();
  const reviewPool: SessionItem[] = [
    ...savedVocabIds.flatMap(id => {
      const item = vocabulary.find(v => v.id === id);
      return item ? [{ kind: 'review_vocab' as const, item }] : [];
    }),
    ...savedExprIds.flatMap(id => {
      const expr = expressions.find(e => e.id === id);
      return expr ? [{ kind: 'review_expression' as const, expression: expr }] : [];
    }),
  ];
  for (let i = 0; i < multiplier; i++) {
    if (reviewPool.length > 0) items.push(reviewPool[i % reviewPool.length]);
  }

  return items;
}
