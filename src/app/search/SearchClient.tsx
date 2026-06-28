"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { search } from "@/lib/search";
import type { SearchResults } from "@/lib/search";
import type { Lesson, VocabularyItem, Expression } from "@/types";

const LEVEL_COLORS: Record<string, string> = {
  A0: "bg-[#1E40AF] text-white",
  A1: "bg-[#1E40AF] text-white",
  A2: "bg-[#D62828] text-white",
  B1: "bg-[#1F2937] text-white",
};

const CATEGORY_COLORS: Record<string, string> = {
  Pronunciation: "bg-purple-100 text-purple-700",
  Grammar: "bg-blue-100 text-blue-700",
  Vocabulary: "bg-green-100 text-green-700",
  Expressions: "bg-yellow-100 text-yellow-800",
  Conversations: "bg-pink-100 text-pink-700",
  Review: "bg-gray-100 text-gray-600",
};

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section aria-labelledby={`section-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <h2
        id={`section-${title.toLowerCase().replace(/\s/g, '-')}`}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
      >
        {title}
        <span className="ml-2 font-normal normal-case text-gray-300">{count} result{count !== 1 ? 's' : ''}</span>
      </h2>
      <ul className="flex flex-col gap-2" role="list">
        {children}
      </ul>
    </section>
  );
}

function LessonResult({ lesson }: { lesson: Lesson }) {
  return (
    <li role="listitem">
      <Link
        href={`/lessons/${lesson.slug}`}
        className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1E40AF]/30 hover:shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#1F2937] text-sm">{lesson.title}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[lesson.level]}`}>
            {lesson.level}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[lesson.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {lesson.category}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{lesson.estimated_minutes} min</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{lesson.explanation}</p>
      </Link>
    </li>
  );
}

function GrammarResult({ lesson }: { lesson: Lesson }) {
  return (
    <li role="listitem">
      <Link
        href="/grammar"
        className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1E40AF]/30 hover:shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#1F2937] text-sm">{lesson.title}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[lesson.level]}`}>
            {lesson.level}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Grammar</span>
          <span className="text-xs text-gray-400 ml-auto">{lesson.estimated_minutes} min</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{lesson.explanation}</p>
      </Link>
    </li>
  );
}

function VocabResult({ item }: { item: VocabularyItem }) {
  return (
    <li role="listitem">
      <Link
        href="/vocabulary"
        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1E40AF]/30 hover:shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span lang="fr" className="font-bold text-[#1F2937]">{item.french}</span>
            {item.gender && (
              <span className="text-xs text-gray-400">{item.gender === 'masculine' ? 'm.' : 'f.'}</span>
            )}
            <span className="text-sm text-gray-600">{item.english}</span>
          </div>
          <p className="text-xs text-gray-400 italic">{item.pronunciation_hint}</p>
          <p lang="fr" className="text-xs text-gray-500 mt-1 line-clamp-1">{item.example_sentence}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[item.level]}`}>
            {item.level}
          </span>
          <span className="text-xs text-gray-400">{item.category}</span>
        </div>
      </Link>
    </li>
  );
}

function ExpressionResult({ expr }: { expr: Expression }) {
  return (
    <li role="listitem">
      <Link
        href="/expressions"
        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1E40AF]/30 hover:shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span lang="fr" className="font-bold text-[#1F2937]">{expr.expression}</span>
            <span className="text-sm text-gray-600">{expr.natural_meaning}</span>
          </div>
          <p className="text-xs text-gray-400 italic">Literally: {expr.literal_translation}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{expr.context}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[expr.level]}`}>
            {expr.level}
          </span>
          <span className="text-xs text-gray-400">{expr.formality}</span>
        </div>
      </Link>
    </li>
  );
}

interface Props {
  initialQuery: string;
}

export default function SearchClient({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(
    initialQuery.trim().length >= 2 ? search(initialQuery) : null
  );
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(search(query));
      const url = `/search?q=${encodeURIComponent(query.trim())}`;
      router.replace(url, { scroll: false });
    } else {
      setResults(null);
    }
  }, [query, router]);

  const hasResults = results && results.total > 0;
  const searched = query.trim().length >= 2;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Search Easy French Lab</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">Search for French words, lessons, expressions, or grammar topics</label>
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden
        />
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "tired", "bonjour", "articles", "ça marche"...'
          autoComplete="off"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-[#1F2937] placeholder-gray-400 text-base shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
        />
      </div>

      {/* Live result status for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {searched && results
          ? results.total === 0
            ? `No results found for "${query}"`
            : `${results.total} result${results.total !== 1 ? 's' : ''} found for "${query}"`
          : ''}
      </div>

      {/* Results */}
      {searched && results && (
        <div>
          {!hasResults && (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-[#1F2937] mb-2">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-gray-500 text-sm">Try a different word or phrase. You can search in English or French.</p>
            </div>
          )}

          {hasResults && (
            <div className="flex flex-col gap-8">
              <p className="text-sm text-gray-500 -mb-4">
                {results.total} result{results.total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>

              <ResultSection title="Lessons" count={results.lessons.length}>
                {results.lessons.map((l) => <LessonResult key={l.id} lesson={l} />)}
              </ResultSection>

              <ResultSection title="Grammar Topics" count={results.grammarTopics.length}>
                {results.grammarTopics.map((l) => <GrammarResult key={l.id} lesson={l} />)}
              </ResultSection>

              <ResultSection title="Vocabulary" count={results.vocabulary.length}>
                {results.vocabulary.slice(0, 10).map((v) => <VocabResult key={v.id} item={v} />)}
                {results.vocabulary.length > 10 && (
                  <li className="text-sm text-gray-400 text-center py-2">
                    + {results.vocabulary.length - 10} more —{' '}
                    <Link href="/vocabulary" className="text-[#1E40AF] underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E40AF] rounded">
                      browse all vocabulary
                    </Link>
                  </li>
                )}
              </ResultSection>

              <ResultSection title="Expressions" count={results.expressions.length}>
                {results.expressions.slice(0, 8).map((e) => <ExpressionResult key={e.id} expr={e} />)}
                {results.expressions.length > 8 && (
                  <li className="text-sm text-gray-400 text-center py-2">
                    + {results.expressions.length - 8} more —{' '}
                    <Link href="/expressions" className="text-[#1E40AF] underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E40AF] rounded">
                      browse all expressions
                    </Link>
                  </li>
                )}
              </ResultSection>
            </div>
          )}
        </div>
      )}

      {/* Idle state */}
      {!searched && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Type at least 2 characters to search across lessons, vocabulary, expressions, and grammar topics.</p>
        </div>
      )}
    </div>
  );
}
