'use client';

import { useState, useRef } from 'react';
import type { SessionItem } from '@/lib/session';
import AudioButton from '@/components/AudioButton';
import ExerciseCard from '@/components/ExerciseCard';

interface DailyPracticeCardProps {
  items: SessionItem[];
  onComplete: (seenVocabIds: string[], completedCount: number) => void;
}

const KIND_LABEL: Record<SessionItem['kind'], string> = {
  vocabulary: 'Vocabulary',
  pronunciation: 'Pronunciation',
  exercise: 'Grammar Exercise',
  expression: 'Native Expression',
  review_vocab: 'Review — Vocabulary',
  review_expression: 'Review — Expression',
};

const KIND_COLOR: Record<SessionItem['kind'], string> = {
  vocabulary: 'bg-blue-50 text-blue-700',
  pronunciation: 'bg-purple-50 text-purple-700',
  exercise: 'bg-yellow-50 text-yellow-700',
  expression: 'bg-green-50 text-green-700',
  review_vocab: 'bg-[#F5EFE6] text-[#1E40AF]',
  review_expression: 'bg-[#F5EFE6] text-[#1E40AF]',
};

export default function DailyPracticeCard({ items, onComplete }: DailyPracticeCardProps) {
  const [index, setIndex] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);
  const seenVocabIds = useRef<string[]>([]);

  const item = items[index];
  if (!item) return null;

  const isExercise = item.kind === 'exercise';
  const canAdvance = !isExercise || exerciseDone;
  const isLast = index === items.length - 1;

  function advance() {
    if (item.kind === 'vocabulary' || item.kind === 'review_vocab') {
      seenVocabIds.current.push(item.item.id);
    }
    if (isLast) {
      onComplete(seenVocabIds.current, items.length);
      return;
    }
    setExerciseDone(false);
    setIndex(i => i + 1);
  }

  const progress = ((index + 1) / items.length) * 100;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress header */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${KIND_COLOR[item.kind]}`}>
          {KIND_LABEL[item.kind]}
        </span>
        <span className="text-gray-400">
          {index + 1} / {items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={items.length}>
        <div
          className="h-full bg-[#1E40AF] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Item content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[200px] flex flex-col gap-4">
        {(item.kind === 'vocabulary' || item.kind === 'review_vocab') && (
          <VocabStep item={item.item} />
        )}
        {item.kind === 'pronunciation' && (
          <PronStep french={item.example.french} english={item.example.english} hint={item.example.pronunciation_hint} ipa={item.example.ipa} categoryTitle={item.categoryTitle} />
        )}
        {item.kind === 'exercise' && (
          <ExerciseCard exercise={item.exercise} onComplete={() => setExerciseDone(true)} />
        )}
        {(item.kind === 'expression' || item.kind === 'review_expression') && (
          <ExprStep expression={item.expression} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={advance}
          disabled={!canAdvance}
          className="px-6 py-2.5 bg-[#1E40AF] text-white text-sm font-semibold rounded-xl hover:bg-[#1E40AF]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
        >
          {isLast ? 'Finish session' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-renderers ─────────────────────────────────────────────────────────────

function VocabStep({ item }: { item: import('@/types').VocabularyItem }) {
  return (
    <>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-3xl font-bold text-[#1F2937]">{item.french}</span>
        {item.gender && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.gender === 'masculine' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-pink-50 text-pink-600 border-pink-200'}`}>
            {item.gender === 'masculine' ? 'm.' : 'f.'}
          </span>
        )}
        <span className="text-xs text-gray-400">{item.part_of_speech}</span>
      </div>
      <p className="text-lg font-semibold text-gray-700">{item.english}</p>
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
      <div className="flex gap-2 flex-wrap mt-auto pt-2">
        <AudioButton text={item.french} label="Play" />
        <AudioButton text={item.french} rate={0.7} label="Play slow" />
      </div>
    </>
  );
}

function PronStep({ french, english, hint, ipa, categoryTitle }: { french: string; english: string; hint: string; ipa?: string; categoryTitle: string }) {
  return (
    <>
      <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest">{categoryTitle}</p>
      <span className="text-3xl font-bold text-[#1F2937]">{french}</span>
      <p className="text-lg font-semibold text-gray-700">{english}</p>
      <p className="text-sm text-gray-400 italic">{hint}</p>
      {ipa && <p className="text-xs text-gray-400 font-mono">[{ipa}]</p>}
      <div className="flex gap-2 flex-wrap mt-auto pt-2">
        <AudioButton text={french} label="Play" />
        <AudioButton text={french} rate={0.6} label="Play slow" />
      </div>
    </>
  );
}

function ExprStep({ expression }: { expression: import('@/types').Expression }) {
  const dialogue = expression.example_dialogue.filter(l => l.french !== '');
  return (
    <>
      <span className="text-3xl font-bold text-[#1F2937]">{expression.expression}</span>
      <p className="text-lg font-semibold text-gray-700">{expression.natural_meaning}</p>
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
      <div className="flex gap-2 flex-wrap mt-auto pt-2">
        <AudioButton text={expression.expression} label="Play" />
      </div>
    </>
  );
}
