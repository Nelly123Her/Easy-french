'use client';

import { useState, useEffect } from 'react';
import { lessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import type { Level, Category } from '@/types';

const LEVELS: Array<'All' | Level> = ['All', 'A0', 'A1', 'A2', 'B1'];
const CATEGORIES: Array<'All' | Category> = [
  'All',
  'Pronunciation',
  'Grammar',
  'Vocabulary',
  'Expressions',
  'Conversations',
  'Exercises',
  'Review',
];

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<'All' | Level>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('efl_completed_lessons');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCompletedIds(new Set(parsed as string[]));
        }
      }
    } catch {
      // localStorage unavailable or data is corrupt
    }
  }, []);

  const filtered = lessons.filter((lesson) => {
    const levelMatch = selectedLevel === 'All' || lesson.level === selectedLevel;
    const categoryMatch = selectedCategory === 'All' || lesson.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  return (
    <main className="min-h-screen bg-[#FFFDF8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">
            Lesson Library
          </h1>
          <p className="text-gray-500 text-lg">Browse all lessons by level and category.</p>
        </div>

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
              {CATEGORIES.map((category) => (
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

        <p className="text-sm text-gray-500 mb-6">
          Showing {filtered.length} of {lessons.length} lessons
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No lessons match the selected filters.</p>
            <button
              onClick={() => { setSelectedLevel('All'); setSelectedCategory('All'); }}
              className="mt-4 text-[#1E40AF] font-semibold text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                completed={completedIds.has(lesson.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
