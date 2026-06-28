const EXERCISE_SCORES_KEY = "efl_exercise_scores";

export interface ExerciseScore {
  score: number;
  completedAt: number;
}

export function saveExerciseScore(exerciseId: string, score: number): void {
  try {
    const raw = localStorage.getItem(EXERCISE_SCORES_KEY);
    const data: Record<string, ExerciseScore> = raw ? JSON.parse(raw) : {};
    data[exerciseId] = { score, completedAt: Date.now() };
    localStorage.setItem(EXERCISE_SCORES_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

export function getExerciseScore(exerciseId: string): ExerciseScore | null {
  try {
    const raw = localStorage.getItem(EXERCISE_SCORES_KEY);
    if (!raw) return null;
    const data: Record<string, ExerciseScore> = JSON.parse(raw);
    return data[exerciseId] ?? null;
  } catch {
    return null;
  }
}

export function getAllExerciseScores(): Record<string, ExerciseScore> {
  try {
    const raw = localStorage.getItem(EXERCISE_SCORES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Saved review items ───────────────────────────────────────────────────────

const SAVED_VOCAB_KEY = 'efl_saved_vocabulary';
const SAVED_EXPRESSIONS_KEY = 'efl_saved_expressions';

function readIdSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed as string[]);
    return new Set();
  } catch {
    return new Set();
  }
}

function writeIdSet(key: string, ids: Set<string>): void {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch {
    // localStorage unavailable
  }
}

export function getSavedVocabIds(): string[] {
  return Array.from(readIdSet(SAVED_VOCAB_KEY));
}

export function saveVocabItem(id: string): void {
  const ids = readIdSet(SAVED_VOCAB_KEY);
  ids.add(id);
  writeIdSet(SAVED_VOCAB_KEY, ids);
}

export function removeVocabItem(id: string): void {
  const ids = readIdSet(SAVED_VOCAB_KEY);
  ids.delete(id);
  writeIdSet(SAVED_VOCAB_KEY, ids);
}

export function isVocabSaved(id: string): boolean {
  return readIdSet(SAVED_VOCAB_KEY).has(id);
}

export function getSavedExpressionIds(): string[] {
  return Array.from(readIdSet(SAVED_EXPRESSIONS_KEY));
}

export function saveExpression(id: string): void {
  const ids = readIdSet(SAVED_EXPRESSIONS_KEY);
  ids.add(id);
  writeIdSet(SAVED_EXPRESSIONS_KEY, ids);
}

export function removeExpression(id: string): void {
  const ids = readIdSet(SAVED_EXPRESSIONS_KEY);
  ids.delete(id);
  writeIdSet(SAVED_EXPRESSIONS_KEY, ids);
}

export function isExpressionSaved(id: string): boolean {
  return readIdSet(SAVED_EXPRESSIONS_KEY).has(id);
}

// ─── Vocabulary last-seen (for daily practice prioritisation) ─────────────────

const VOCAB_LAST_SEEN_KEY = 'efl_vocab_last_seen';

export function getVocabLastSeen(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VOCAB_LAST_SEEN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markVocabSeen(ids: string[]): void {
  try {
    const data = getVocabLastSeen();
    const now = Date.now();
    ids.forEach(id => { data[id] = now; });
    localStorage.setItem(VOCAB_LAST_SEEN_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

// ─── Reviewed-today tracking (resets each calendar day) ──────────────────────

const REVIEWED_TODAY_KEY = 'efl_reviewed_today';

interface ReviewedTodayData {
  vocab: Record<string, string>;
  expression: Record<string, string>;
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function readReviewedToday(): ReviewedTodayData {
  try {
    const raw = localStorage.getItem(REVIEWED_TODAY_KEY);
    if (!raw) return { vocab: {}, expression: {} };
    return JSON.parse(raw) as ReviewedTodayData;
  } catch {
    return { vocab: {}, expression: {} };
  }
}

export function getReviewedTodayIds(type: 'vocab' | 'expression'): string[] {
  const data = readReviewedToday();
  const today = getTodayDateString();
  return Object.entries(data[type])
    .filter(([, date]) => date === today)
    .map(([id]) => id);
}

export function markReviewedToday(type: 'vocab' | 'expression', id: string): void {
  try {
    const data = readReviewedToday();
    data[type][id] = getTodayDateString();
    localStorage.setItem(REVIEWED_TODAY_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

// ─── Daily session log ────────────────────────────────────────────────────────

const DAILY_SESSIONS_KEY = 'efl_daily_sessions';

export interface DailySession {
  date: string;
  durationMinutes: number;
  itemsCompleted: number;
}

export function saveDailySession(durationMinutes: number, itemsCompleted: number): void {
  try {
    const raw = localStorage.getItem(DAILY_SESSIONS_KEY);
    const sessions: DailySession[] = raw ? JSON.parse(raw) : [];
    sessions.push({ date: getTodayDateString(), durationMinutes, itemsCompleted });
    localStorage.setItem(DAILY_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage unavailable
  }
}

export function getDailySessions(): DailySession[] {
  try {
    const raw = localStorage.getItem(DAILY_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
