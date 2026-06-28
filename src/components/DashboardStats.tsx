'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lessons } from '@/data/lessons';
import { exercises as allExercises } from '@/data/exercises';
import {
  getCompletedLessons,
  getAllExerciseScores,
  getSavedVocabIds,
  getSavedExpressionIds,
  getVocabLastSeen,
  getDailySessions,
  getStreak,
} from '@/lib/progress';
import ProgressBar from '@/components/ProgressBar';
import type { Level } from '@/types';

const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1'];

const LEVEL_LABEL: Record<Level, string> = {
  A0: 'Absolute Beginner',
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Lower Intermediate',
};

const LEVEL_COLOR: Record<Level, string> = {
  A0: 'bg-[#1E40AF]',
  A1: 'bg-[#1E40AF]/80',
  A2: 'bg-[#D62828]',
  B1: 'bg-[#1F2937]',
};

const LEVEL_TEXT: Record<Level, string> = {
  A0: 'text-[#1E40AF]',
  A1: 'text-[#1E40AF]',
  A2: 'text-[#D62828]',
  B1: 'text-[#1F2937]',
};

interface Stats {
  completedLessons: string[];
  exercisesAttempted: number;
  exerciseAccuracy: number;
  practiceSessionCount: number;
  wordsEncountered: number;
  expressionsSaved: number;
  streak: number;
  currentLevel: Level;
}

interface WeakTopic {
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  attempted: number;
  accuracy: number;
}

interface Recommendation {
  level: Level;
  title: string;
  slug: string;
  estimatedMinutes: number;
}

function computeStats(): Stats {
  const completedLessons = getCompletedLessons();
  const exerciseScores = getAllExerciseScores();
  const vocabLastSeen = getVocabLastSeen();
  const sessions = getDailySessions();

  const attempted = Object.keys(exerciseScores);
  const totalScore = attempted.reduce(
    (sum, id) => sum + (exerciseScores[id]?.score ?? 0),
    0
  );
  const exerciseAccuracy =
    attempted.length > 0 ? Math.round(totalScore / attempted.length) : 0;

  // Derive current level from highest level of any completed lesson
  let currentLevel: Level = 'A0';
  for (const level of LEVELS) {
    const hasCompleted = completedLessons.some(id =>
      lessons.find(l => l.id === id && l.level === level)
    );
    if (hasCompleted) currentLevel = level;
  }

  return {
    completedLessons,
    exercisesAttempted: attempted.length,
    exerciseAccuracy,
    practiceSessionCount: sessions.length,
    wordsEncountered: Object.keys(vocabLastSeen).length,
    expressionsSaved: getSavedExpressionIds().length,
    streak: getStreak(),
    currentLevel,
  };
}

function computeWeakTopics(completedLessonIds: string[]): WeakTopic[] {
  const exerciseScores = getAllExerciseScores();

  const grouped: Record<
    string,
    { lessonTitle: string; lessonSlug: string; scores: number[] }
  > = {};

  for (const ex of allExercises) {
    const score = exerciseScores[ex.id];
    if (!score) continue;
    if (!grouped[ex.related_lesson_id]) {
      const lesson = lessons.find(l => l.id === ex.related_lesson_id);
      if (!lesson) continue;
      grouped[ex.related_lesson_id] = {
        lessonTitle: lesson.title,
        lessonSlug: lesson.slug,
        scores: [],
      };
    }
    grouped[ex.related_lesson_id].scores.push(score.score);
  }

  return Object.entries(grouped)
    .map(([lessonId, { lessonTitle, lessonSlug, scores }]) => ({
      lessonId,
      lessonTitle,
      lessonSlug,
      attempted: scores.length,
      accuracy: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .filter(t => t.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
}

function computeRecommendations(completedLessonIds: string[]): Recommendation[] {
  return LEVELS.flatMap(level => {
    const levelLessons = lessons.filter(l => l.level === level);
    const next = levelLessons.find(l => !completedLessonIds.includes(l.id));
    if (!next) return [];
    return [
      {
        level,
        title: next.title,
        slug: next.slug,
        estimatedMinutes: next.estimated_minutes,
      },
    ];
  });
}

function levelProgress(level: Level, completedLessonIds: string[]) {
  const levelLessons = lessons.filter(l => l.level === level);
  const done = levelLessons.filter(l => completedLessonIds.includes(l.id)).length;
  return { done, total: levelLessons.length, pct: levelLessons.length > 0 ? Math.round((done / levelLessons.length) * 100) : 0 };
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

function StatCard({ label, value, sub, accent = 'text-[#1E40AF]' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-3xl font-bold ${accent}`}>{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const s = computeStats();
    setStats(s);
    setWeakTopics(computeWeakTopics(s.completedLessons));
    setRecommendations(computeRecommendations(s.completedLessons));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-gray-400 text-sm">Loading your progress...</span>
      </div>
    );
  }

  const isNewUser = stats.completedLessons.length === 0 && stats.exercisesAttempted === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Your Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your French learning progress.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#F5EFE6] text-[#1E40AF]">
          <span className="w-2 h-2 rounded-full bg-[#1E40AF] inline-block" aria-hidden />
          Level {stats.currentLevel} — {LEVEL_LABEL[stats.currentLevel]}
        </div>
      </div>

      {/* New-user empty state */}
      {isNewUser && (
        <div className="bg-[#F5EFE6] rounded-2xl p-6 text-center border border-[#1E40AF]/10">
          <p className="text-[#1F2937] font-semibold mb-2">Welcome to Easy French Lab</p>
          <p className="text-gray-600 text-sm mb-4">
            Complete your first lesson to start tracking progress here.
          </p>
          <Link
            href="/lessons"
            className="inline-block px-5 py-2.5 bg-[#1E40AF] text-white font-semibold rounded-xl text-sm hover:bg-[#1E40AF]/90 transition-colors"
          >
            Browse Lessons
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div>
        <h2 className="text-base font-semibold text-[#1F2937] mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Lessons Completed"
            value={`${stats.completedLessons.length} / 20`}
            sub={`${Math.round((stats.completedLessons.length / 20) * 100)}% of the course`}
          />
          <StatCard
            label="Exercise Accuracy"
            value={stats.exercisesAttempted > 0 ? `${stats.exerciseAccuracy}%` : '—'}
            sub={stats.exercisesAttempted > 0 ? `${stats.exercisesAttempted} exercises attempted` : 'No exercises yet'}
            accent={
              stats.exercisesAttempted === 0
                ? 'text-gray-400'
                : stats.exerciseAccuracy >= 70
                ? 'text-[#16A34A]'
                : 'text-[#F59E0B]'
            }
          />
          <StatCard
            label="Current Streak"
            value={stats.streak > 0 ? `${stats.streak} day${stats.streak === 1 ? '' : 's'}` : '—'}
            sub={stats.streak > 0 ? 'Keep it going today' : 'Complete a session to start'}
            accent={stats.streak > 0 ? 'text-[#D62828]' : 'text-gray-400'}
          />
          <StatCard
            label="Practice Sessions"
            value={stats.practiceSessionCount > 0 ? stats.practiceSessionCount : '—'}
            sub={stats.practiceSessionCount > 0 ? 'Daily sessions completed' : 'No sessions yet'}
            accent={stats.practiceSessionCount > 0 ? 'text-[#1E40AF]' : 'text-gray-400'}
          />
          <StatCard
            label="Words Encountered"
            value={stats.wordsEncountered > 0 ? stats.wordsEncountered : '—'}
            sub={stats.wordsEncountered > 0 ? 'from daily practice' : 'Practice to build vocabulary'}
            accent={stats.wordsEncountered > 0 ? 'text-[#1E40AF]' : 'text-gray-400'}
          />
          <StatCard
            label="Expressions Saved"
            value={stats.expressionsSaved > 0 ? stats.expressionsSaved : '—'}
            sub={stats.expressionsSaved > 0 ? 'in your review list' : 'Save expressions to review'}
            accent={stats.expressionsSaved > 0 ? 'text-[#1E40AF]' : 'text-gray-400'}
          />
        </div>
      </div>

      {/* Level progress */}
      <div>
        <h2 className="text-base font-semibold text-[#1F2937] mb-4">Learning Path</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {LEVELS.map(level => {
            const { done, total, pct } = levelProgress(level, stats.completedLessons);
            const barColor =
              pct === 100
                ? 'bg-[#16A34A]'
                : pct > 0
                ? LEVEL_COLOR[level]
                : 'bg-gray-200';
            return (
              <div key={level} className="px-5 py-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 ${LEVEL_TEXT[level]}`}>
                      {level}
                    </span>
                    <span className="text-sm text-[#1F2937] font-medium">{LEVEL_LABEL[level]}</span>
                  </div>
                  <span className="text-xs text-gray-500">{done} / {total} lessons</span>
                </div>
                <ProgressBar value={pct} color={barColor} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest topics */}
      {weakTopics.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1F2937] mb-4">Topics to Review</h2>
          <div className="space-y-3">
            {weakTopics.map(topic => (
              <div
                key={topic.lessonId}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1F2937] truncate">{topic.lessonTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {topic.attempted} exercise{topic.attempted === 1 ? '' : 's'} attempted
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      topic.accuracy >= 70 ? 'text-[#16A34A]' : 'text-[#D62828]'
                    }`}
                  >
                    {topic.accuracy}%
                  </span>
                  <Link
                    href={`/lessons/${topic.lessonSlug}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#F5EFE6] text-[#1E40AF] font-semibold hover:bg-[#1E40AF] hover:text-white transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended next lessons */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1F2937] mb-4">Recommended Next Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map(rec => (
              <Link
                key={rec.slug}
                href={`/lessons/${rec.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#1E40AF]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 ${LEVEL_TEXT[rec.level]}`}
                  >
                    {rec.level}
                  </span>
                  <span className="text-xs text-gray-400">{rec.estimatedMinutes} min</span>
                </div>
                <p className="text-sm font-semibold text-[#1F2937] group-hover:text-[#1E40AF] transition-colors leading-snug">
                  {rec.title}
                </p>
                <p className="text-xs text-[#1E40AF] mt-2 font-medium">Start lesson →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No recommendations: all lessons done */}
      {!isNewUser && recommendations.length === 0 && (
        <div className="bg-[#F5EFE6] rounded-2xl p-6 text-center border border-[#16A34A]/20">
          <p className="text-[#16A34A] font-semibold mb-1">All lessons complete</p>
          <p className="text-gray-600 text-sm">
            Excellent work. Keep practicing daily and reviewing saved items.
          </p>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-[#1F2937] mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/practice', label: 'Daily Practice' },
            { href: '/review', label: 'Review Items' },
            { href: '/grammar', label: 'Grammar Workbook' },
            { href: '/vocabulary', label: 'Vocabulary' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-center py-3 px-2 rounded-xl bg-[#F5EFE6] text-[#1E40AF] text-sm font-semibold hover:bg-[#1E40AF] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
