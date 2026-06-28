'use client';

import { useState } from 'react';
import Link from 'next/link';
import { buildSession, type SessionDuration } from '@/lib/session';
import type { SessionItem } from '@/lib/session';
import DailyPracticeCard from '@/components/DailyPracticeCard';
import { markVocabSeen, saveDailySession } from '@/lib/progress';

type Phase = 'picking' | 'active' | 'done';

const DURATION_OPTIONS: Array<{ minutes: SessionDuration; label: string; description: string }> = [
  {
    minutes: 5,
    label: '5 minutes',
    description: '3 vocabulary words, 1 pronunciation, 1 grammar exercise, 1 expression, 1 review item',
  },
  {
    minutes: 10,
    label: '10 minutes',
    description: '6 vocabulary words, 2 pronunciation, 2 grammar exercises, 2 expressions, 2 review items',
  },
  {
    minutes: 15,
    label: '15 minutes',
    description: '9 vocabulary words, 3 pronunciation, 3 grammar exercises, 3 expressions, 3 review items',
  },
];

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>('picking');
  const [duration, setDuration] = useState<SessionDuration>(5);
  const [items, setItems] = useState<SessionItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  function startSession(minutes: SessionDuration) {
    const sessionItems = buildSession(minutes);
    setDuration(minutes);
    setItems(sessionItems);
    setPhase('active');
  }

  function handleComplete(seenVocabIds: string[], count: number) {
    markVocabSeen(seenVocabIds);
    saveDailySession(duration, count);
    setCompletedCount(count);
    setPhase('done');
  }

  function restart() {
    setItems([]);
    setCompletedCount(0);
    setPhase('picking');
  }

  if (phase === 'picking') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Daily Practice</h1>
        <p className="text-gray-500 mb-10">
          Choose a session length. We will surface vocabulary you have not seen recently, pronunciation practice, grammar exercises where you scored lowest, a native expression, and a review of your saved items.
        </p>

        <div className="flex flex-col gap-4">
          {DURATION_OPTIONS.map(({ minutes, label, description }) => (
            <button
              key={minutes}
              onClick={() => startSession(minutes)}
              className="group w-full text-left rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-[#1E40AF] hover:shadow-md transition-all duration-200 p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-[#1F2937] group-hover:text-[#1E40AF] transition-colors">
                  {label}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5EFE6] text-[#1E40AF]">
                  Start
                </span>
              </div>
              <p className="text-sm text-gray-500">{description}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 text-center">
            Want to review saved items?{' '}
            <Link href="/review" className="text-[#1E40AF] font-medium hover:underline">
              Go to Review
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'active') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daily Practice</h1>
            <p className="text-sm text-gray-400 mt-0.5">{duration}-minute session</p>
          </div>
          <button
            onClick={restart}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded"
          >
            End session
          </button>
        </div>

        <DailyPracticeCard items={items} onComplete={handleComplete} />
      </div>
    );
  }

  // Done phase
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Session complete</h2>
          <p className="text-gray-500">
            You completed <span className="font-semibold text-[#1F2937]">{completedCount} items</span> in your {duration}-minute session.
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl px-6 py-4 text-sm text-gray-600 w-full text-left">
          Your progress has been saved. Come back tomorrow to keep your streak going.
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={restart}
            className="px-5 py-2.5 bg-[#1E40AF] text-white text-sm font-semibold rounded-xl hover:bg-[#1E40AF]/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            Start another session
          </button>
          <Link
            href="/review"
            className="px-5 py-2.5 border border-gray-200 text-[#1F2937] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            Go to Review
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 border border-gray-200 text-[#1F2937] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
