'use client';

import { useState, useEffect, useMemo } from 'react';
import { vocabulary } from '@/data/vocabulary';
import VocabularyCard from '@/components/VocabularyCard';
import { getSavedVocabIds, saveVocabItem, removeVocabItem } from '@/lib/progress';
import type { Level } from '@/types';

const LEVELS: Array<'All' | Level> = ['All', 'A0', 'A1', 'A2', 'B1'];

const ALL_CATEGORIES = Array.from(new Set(vocabulary.map((v) => v.category))).sort();

export default function VocabularyPage() {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | Level>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedIds(new Set(getSavedVocabIds()));
  }, []);

  function handleToggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        removeVocabItem(id);
      } else {
        next.add(id);
        saveVocabItem(id);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return vocabulary.filter((item) => {
      const levelMatch = selectedLevel === 'All' || item.level === selectedLevel;
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const queryMatch =
        !q ||
        item.french.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        (item.memory_tip ?? '').toLowerCase().includes(q);
      return levelMatch && categoryMatch && queryMatch;
    });
  }, [query, selectedLevel, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#FFFDF8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">Vocabulary</h1>
          <p className="text-gray-500 text-lg">
            100 words grouped by real-life situations, each with audio and a memory tip.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="vocab-search" className="sr-only">
            Search vocabulary
          </label>
          <input
            id="vocab-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in French or English..."
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-5 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Level</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                    selectedLevel === level
                      ? 'bg-[#1E40AF] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E40AF] hover:text-[#1E40AF]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                  selectedCategory === 'All'
                    ? 'bg-[#1E40AF] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E40AF] hover:text-[#1E40AF]'
                }`}
              >
                All
              </button>
              {ALL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                    selectedCategory === category
                      ? 'bg-[#1E40AF] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E40AF] hover:text-[#1E40AF]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing {filtered.length} of {vocabulary.length} items
          {savedIds.size > 0 && (
            <span className="ml-2 text-[#1E40AF] font-medium">
              — {savedIds.size} saved
            </span>
          )}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No vocabulary matches your search.</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
              className="mt-4 text-[#1E40AF] font-semibold text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <VocabularyCard
                key={item.id}
                item={item}
                saved={savedIds.has(item.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
