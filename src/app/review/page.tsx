'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { vocabulary } from '@/data/vocabulary';
import { expressions } from '@/data/expressions';
import { exercises } from '@/data/exercises';
import AudioButton from '@/components/AudioButton';
import ExerciseCard from '@/components/ExerciseCard';
import {
  getSavedVocabIds,
  getSavedExpressionIds,
  getAllExerciseScores,
  getReviewedTodayIds,
  markReviewedToday,
} from '@/lib/progress';
import type { VocabularyItem, Expression, Exercise } from '@/types';

type Tab = 'vocabulary' | 'expressions' | 'exercises';

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>('vocabulary');
  const [savedVocab, setSavedVocab] = useState<VocabularyItem[]>([]);
  const [savedExprs, setSavedExprs] = useState<Expression[]>([]);
  const [missedExercises, setMissedExercises] = useState<Exercise[]>([]);
  const [reviewedVocabIds, setReviewedVocabIds] = useState<Set<string>>(new Set());
  const [reviewedExprIds, setReviewedExprIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const vocabIds = getSavedVocabIds();
    const exprIds = getSavedExpressionIds();
    const scores = getAllExerciseScores();

    setSavedVocab(
      vocabIds.flatMap(id => {
        const item = vocabulary.find(v => v.id === id);
        return item ? [item] : [];
      })
    );

    setSavedExprs(
      exprIds.flatMap(id => {
        const expr = expressions.find(e => e.id === id);
        return expr ? [expr] : [];
      })
    );

    // Missed = scored < 70 or never attempted but was skipped (score 0)
    const missed = exercises.filter(ex => {
      const s = scores[ex.id];
      return s !== undefined && s.score < 70;
    });
    setMissedExercises(missed);

    setReviewedVocabIds(new Set(getReviewedTodayIds('vocab')));
    setReviewedExprIds(new Set(getReviewedTodayIds('expression')));
  }, []);

  function markVocabReviewed(id: string) {
    markReviewedToday('vocab', id);
    setReviewedVocabIds(prev => new Set([...prev, id]));
  }

  function markExprReviewed(id: string) {
    markReviewedToday('expression', id);
    setReviewedExprIds(prev => new Set([...prev, id]));
  }

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'vocabulary', label: 'Vocabulary', count: savedVocab.length },
    { key: 'expressions', label: 'Expressions', count: savedExprs.length },
    { key: 'exercises', label: 'Missed Exercises', count: missedExercises.length },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Review</h1>
        <p className="text-gray-500">
          Revisit the vocabulary and expressions you saved, and retry exercises where you scored below 70%.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
              activeTab === tab.key
                ? 'bg-white text-[#1F2937] shadow-sm'
                : 'text-gray-500 hover:text-[#1F2937]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? 'bg-[#F5EFE6] text-[#1E40AF]' : 'bg-gray-200 text-gray-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vocabulary tab */}
      {activeTab === 'vocabulary' && (
        <div role="tabpanel">
          {savedVocab.length === 0 ? (
            <EmptyState
              message="No vocabulary saved yet."
              linkHref="/vocabulary"
              linkLabel="Browse vocabulary"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {savedVocab.map(item => (
                <ReviewVocabRow
                  key={item.id}
                  item={item}
                  reviewedToday={reviewedVocabIds.has(item.id)}
                  onMarkReviewed={() => markVocabReviewed(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expressions tab */}
      {activeTab === 'expressions' && (
        <div role="tabpanel">
          {savedExprs.length === 0 ? (
            <EmptyState
              message="No expressions saved yet."
              linkHref="/expressions"
              linkLabel="Browse expressions"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {savedExprs.map(expr => (
                <ReviewExprRow
                  key={expr.id}
                  expression={expr}
                  reviewedToday={reviewedExprIds.has(expr.id)}
                  onMarkReviewed={() => markExprReviewed(expr.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Missed Exercises tab */}
      {activeTab === 'exercises' && (
        <div role="tabpanel">
          {missedExercises.length === 0 ? (
            <EmptyState
              message="No missed exercises. Keep it up."
              linkHref="/grammar"
              linkLabel="Go to Grammar Workbook"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {missedExercises.map((exercise, i) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white text-sm font-semibold rounded-xl hover:bg-[#1E40AF]/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
        >
          Start Daily Practice session
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function EmptyState({ message, linkHref, linkLabel }: { message: string; linkHref: string; linkLabel: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-400 mb-4">{message}</p>
      <Link
        href={linkHref}
        className="text-[#1E40AF] text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

function ReviewedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-[#16A34A] border border-green-100">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
      Reviewed today
    </span>
  );
}

function MarkReviewedButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium text-gray-400 hover:text-[#1E40AF] border border-gray-200 hover:border-[#1E40AF] px-3 py-1.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
    >
      Mark reviewed
    </button>
  );
}

function ReviewVocabRow({
  item,
  reviewedToday,
  onMarkReviewed,
}: {
  item: VocabularyItem;
  reviewedToday: boolean;
  onMarkReviewed: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className="w-full text-left px-5 py-4 flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded-2xl"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-[#1F2937]">{item.french}</span>
            {item.gender && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${item.gender === 'masculine' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-pink-50 text-pink-600 border-pink-200'}`}>
                {item.gender === 'masculine' ? 'm.' : 'f.'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{item.english}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {reviewedToday ? <ReviewedBadge /> : <MarkReviewedButton onClick={onMarkReviewed} />}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-50 pt-4">
          <p className="text-sm text-gray-400 italic">{item.pronunciation_hint}</p>
          {item.ipa && <p className="text-xs text-gray-400 font-mono">[{item.ipa}]</p>}
          <div className="bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl p-3 text-sm">
            <p className="text-[#1F2937] font-medium">{item.example_sentence}</p>
            <p className="text-gray-500 mt-1">{item.example_translation}</p>
          </div>
          {item.memory_tip && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
              <span className="font-semibold">Tip: </span>{item.memory_tip}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <AudioButton text={item.french} label="Play" />
            <AudioButton text={item.french} rate={0.7} label="Play slow" />
            {!reviewedToday && (
              <button
                onClick={onMarkReviewed}
                className="ml-auto text-xs font-medium text-gray-400 hover:text-[#1E40AF] border border-gray-200 hover:border-[#1E40AF] px-3 py-1.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
              >
                Mark reviewed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewExprRow({
  expression,
  reviewedToday,
  onMarkReviewed,
}: {
  expression: Expression;
  reviewedToday: boolean;
  onMarkReviewed: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dialogue = expression.example_dialogue.filter(l => l.french !== '');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className="w-full text-left px-5 py-4 flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded-2xl"
      >
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1F2937]">{expression.expression}</p>
          <p className="text-sm text-gray-500 truncate">{expression.natural_meaning}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {reviewedToday ? <ReviewedBadge /> : <MarkReviewedButton onClick={onMarkReviewed} />}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-50 pt-4">
          <p className="text-sm text-gray-400 italic">Literally: {expression.literal_translation}</p>
          <p className="text-sm text-gray-400 italic">{expression.pronunciation_hint}</p>
          <p className="text-sm text-gray-600">{expression.context}</p>
          {dialogue.length > 0 && (
            <div className="bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl p-3 flex flex-col gap-2">
              {dialogue.map((line, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="font-bold text-[#1E40AF] shrink-0 w-4">{line.speaker}</span>
                  <div>
                    <p className="font-medium text-[#1F2937]">{line.french}</p>
                    <p className="text-gray-500">{line.english}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap items-center">
            <AudioButton text={expression.expression} label="Play" />
            {!reviewedToday && (
              <button
                onClick={onMarkReviewed}
                className="ml-auto text-xs font-medium text-gray-400 hover:text-[#1E40AF] border border-gray-200 hover:border-[#1E40AF] px-3 py-1.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
              >
                Mark reviewed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
