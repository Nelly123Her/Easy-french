'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { soundCategories, type SoundCategory, type SoundExample, type MinimalPair } from '@/data/pronunciation';
import AudioButton from '@/components/AudioButton';

// ---------------------------------------------------------------------------
// Local sub-components
// ---------------------------------------------------------------------------

function SyllableDisplay({ syllables }: { syllables: string[] }) {
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-sm">
      {syllables.map((s, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="text-gray-300 select-none">•</span>}
          <span className="text-[#1E40AF] font-semibold">{s}</span>
        </span>
      ))}
    </span>
  );
}

function PracticePrompt({ text, label }: { text: string; label?: string }) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'repeat'>('idle');
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const startPractice = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (phase === 'playing') return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.85;
    utter.onstart = () => setPhase('playing');
    utter.onend = () => setPhase('repeat');
    utter.onerror = () => setPhase('idle');
    utterRef.current = utter;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [text, phase]);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={phase === 'repeat' ? () => setPhase('idle') : startPractice}
        disabled={phase === 'playing'}
        aria-label={phase === 'playing' ? 'Playing audio' : `Practice: ${text}`}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed bg-[#1E40AF] text-white hover:bg-[#1e3a8a] w-fit"
      >
        {phase === 'playing' ? 'Listening...' : phase === 'repeat' ? 'Practice again' : `Practice${label ? `: ${label}` : ''}`}
      </button>

      {phase === 'repeat' && (
        <p className="text-sm font-semibold text-[#16A34A] bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 w-fit">
          Now say it out loud!
        </p>
      )}
    </div>
  );
}

function ExampleRow({ example }: { example: SoundExample }) {
  return (
    <div className="bg-[#F5EFE6] rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-[#1F2937]">{example.french}</p>
          <p className="text-sm text-gray-500 mt-0.5">{example.english}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <AudioButton text={example.french} label="Play" />
          <AudioButton text={example.french} rate={0.6} label="Slow" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs mt-1">
        <span className="text-[#1E40AF] font-medium">{example.pronunciation_hint}</span>
        {example.ipa && (
          <span className="text-gray-400 font-mono">[{example.ipa}]</span>
        )}
        {example.syllables && example.syllables.length > 1 && (
          <SyllableDisplay syllables={example.syllables} />
        )}
      </div>
    </div>
  );
}

function MinimalPairRow({ pair }: { pair: MinimalPair }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5">
        <p className="font-bold text-[#1F2937] text-base">{pair.a.french}</p>
        <p className="text-xs text-gray-500">{pair.a.english}</p>
        {pair.a.ipa && <p className="text-xs text-gray-400 font-mono">[{pair.a.ipa}]</p>}
        <div className="mt-1">
          <AudioButton text={pair.a.french} label="Play A" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5">
        <p className="font-bold text-[#1F2937] text-base">{pair.b.french}</p>
        <p className="text-xs text-gray-500">{pair.b.english}</p>
        {pair.b.ipa && pair.b.ipa !== '' && (
          <p className="text-xs text-gray-400 font-mono">[{pair.b.ipa}]</p>
        )}
        <div className="mt-1">
          <AudioButton text={pair.b.french} label="Play B" />
        </div>
      </div>
    </div>
  );
}

function SoundSection({ category }: { category: SoundCategory }) {
  return (
    <article aria-labelledby={`section-${category.id}`}>
      {/* Section header */}
      <div className="mb-8">
        <h2
          id={`section-${category.id}`}
          className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-1"
        >
          {category.title}
        </h2>
        <p className="text-gray-500 text-base">{category.subtitle}</p>
      </div>

      {/* Explanation */}
      <p className="text-[#1F2937] leading-relaxed mb-6">{category.explanation}</p>

      {/* Mouth/tongue tip */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1E40AF] mb-2">
          Mouth and tongue position
        </p>
        <p className="text-sm text-[#1F2937] leading-relaxed">{category.mouth_description}</p>
      </div>

      {/* Examples */}
      <section aria-label="Examples">
        <h3 className="text-base font-semibold text-[#1F2937] mb-3">Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {category.examples.map((ex, i) => (
            <ExampleRow key={i} example={ex} />
          ))}
        </div>
      </section>

      {/* Minimal pairs */}
      {category.minimal_pairs.length > 0 && (
        <section aria-label="Minimal pairs" className="mb-8">
          <h3 className="text-base font-semibold text-[#1F2937] mb-1">Minimal pairs</h3>
          <p className="text-sm text-gray-500 mb-3">
            Two words that differ by only one sound. Listen closely and compare.
          </p>
          <div className="flex flex-col gap-3">
            {category.minimal_pairs.map((pair, i) => (
              <MinimalPairRow key={i} pair={pair} />
            ))}
          </div>
        </section>
      )}

      {/* Practice */}
      <section aria-label="Practice" className="mb-8">
        <h3 className="text-base font-semibold text-[#1F2937] mb-3">Practice</h3>
        <div className="bg-[#F5EFE6] rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-sm text-[#1F2937]">
            Listen to the first example, then try saying it out loud.
          </p>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl text-[#1F2937]">{category.examples[0].french}</p>
            <p className="text-sm text-gray-500">{category.examples[0].pronunciation_hint}</p>
          </div>
          <PracticePrompt
            text={category.examples[0].french}
            label={category.examples[0].french}
          />
        </div>
      </section>

      {/* Common mistakes */}
      <section aria-label="Common mistakes" className="mb-8">
        <h3 className="text-base font-semibold text-[#1F2937] mb-3">Common mistakes</h3>
        <ul className="flex flex-col gap-2" role="list">
          {category.common_mistakes.map((mistake, i) => (
            <li
              key={i}
              className="flex gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-[#1F2937]"
            >
              <span className="text-[#D62828] font-bold shrink-0 mt-0.5" aria-hidden>
                !
              </span>
              {mistake}
            </li>
          ))}
        </ul>
      </section>

      {/* Related lesson link */}
      {category.related_lesson_slug && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-2">Related lesson</p>
          <Link
            href={`/lessons/${category.related_lesson_slug}`}
            className="text-sm font-semibold text-[#1E40AF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded"
          >
            Lesson 1: The French Alphabet and Sounds
          </Link>
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PronunciationPage() {
  const [activeId, setActiveId] = useState(soundCategories[0].id);

  const active = soundCategories.find((c) => c.id === activeId) ?? soundCategories[0];

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">
            Pronunciation Practice
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Master the 8 core French sounds with explanations, audio comparisons, minimal pair
            drills, and practice prompts.
          </p>
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div
          className="max-w-5xl mx-auto px-4 overflow-x-auto"
          role="tablist"
          aria-label="Sound categories"
        >
          <div className="flex gap-1 pb-px min-w-max">
            {soundCategories.map((cat) => {
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  id={`tab-${cat.id}`}
                  onClick={() => setActiveId(cat.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                    isActive
                      ? 'border-[#1E40AF] text-[#1E40AF]'
                      : 'border-transparent text-gray-500 hover:text-[#1F2937] hover:border-gray-300'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active panel */}
      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        <SoundSection category={active} />
      </div>
    </div>
  );
}
