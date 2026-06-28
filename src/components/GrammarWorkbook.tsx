"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { exercises as allExercises } from "@/data/exercises";
import { getAllExerciseScores } from "@/lib/progress";
import AudioButton from "@/components/AudioButton";
import ExerciseCard from "@/components/ExerciseCard";
import type { Exercise, Lesson } from "@/types";
import type { ExerciseScore } from "@/lib/progress";

const LEVEL_COLORS: Record<string, string> = {
  A0: "bg-[#1E40AF] text-white",
  A1: "bg-[#1E40AF] text-white",
  A2: "bg-[#D62828] text-white",
  B1: "bg-[#1F2937] text-white",
};

function getGrammarExercises(lessonId: string): Exercise[] {
  return allExercises.filter(
    (e) => e.related_lesson_id === lessonId && e.skill === "Grammar"
  );
}

function calcProgress(
  exercises: Exercise[],
  scores: Record<string, ExerciseScore>
) {
  const total = exercises.length;
  const completed = exercises.filter((e) => scores[e.id] !== undefined).length;
  const scoreSum = exercises.reduce(
    (sum, e) => sum + (scores[e.id]?.score ?? 0),
    0
  );
  const accuracy = completed > 0 ? Math.round(scoreSum / total) : 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, accuracy, pct };
}

function TopicProgressBar({
  exercises,
  scores,
}: {
  exercises: Exercise[];
  scores: Record<string, ExerciseScore>;
}) {
  const { total, completed, accuracy, pct } = calcProgress(exercises, scores);
  if (total === 0) return null;

  const barColor =
    completed === 0
      ? "bg-gray-200"
      : accuracy >= 70
      ? "bg-[#16A34A]"
      : "bg-[#F59E0B]";

  return (
    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>
          <span className="font-semibold text-[#1F2937]">{completed}</span> /{" "}
          {total} exercises completed
        </span>
        {completed > 0 && (
          <span
            className={
              accuracy >= 70
                ? "font-semibold text-[#16A34A]"
                : "font-semibold text-[#F59E0B]"
            }
          >
            {accuracy}% accuracy
          </span>
        )}
      </div>
      <div
        className="h-2 rounded-full bg-gray-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% of exercises completed`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SidebarItem({
  lesson,
  exercises,
  scores,
}: {
  lesson: Lesson;
  exercises: Exercise[];
  scores: Record<string, ExerciseScore>;
}) {
  const { total, completed, accuracy } = calcProgress(exercises, scores);
  const badgeColor =
    completed === total && total > 0
      ? "bg-green-100 text-[#16A34A]"
      : completed > 0
      ? "bg-yellow-100 text-[#F59E0B]"
      : "bg-gray-100 text-gray-400";

  return (
    <li>
      <a
        href={`#topic-${lesson.id}`}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-[#1F2937] hover:bg-[#F5EFE6] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] group"
      >
        <span className="line-clamp-2 group-hover:text-[#1E40AF] transition-colors">
          {lesson.title}
        </span>
        {total > 0 && (
          <span
            className={`flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full ${badgeColor}`}
            aria-label={`${completed} of ${total} exercises completed, ${accuracy}% accuracy`}
          >
            {completed}/{total}
          </span>
        )}
      </a>
    </li>
  );
}

export default function GrammarWorkbook() {
  const [scores, setScores] = useState<Record<string, ExerciseScore>>({});

  useEffect(() => {
    setScores(getAllExerciseScores());
  }, []);

  const refreshScores = useCallback(() => {
    setScores(getAllExerciseScores());
  }, []);

  const grammarLessons = lessons.filter(
    (lesson) => getGrammarExercises(lesson.id).length > 0
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Page header */}
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
            Grammar Workbook
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Work through each grammar topic with explanations, examples, and
            exercises. Your progress saves automatically as you go.
          </p>
        </header>

        <div className="flex gap-10 items-start">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-6 self-start">
            <nav aria-label="Grammar topics">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">
                Topics
              </p>
              <ul className="flex flex-col gap-0.5">
                {grammarLessons.map((lesson) => (
                  <SidebarItem
                    key={lesson.id}
                    lesson={lesson}
                    exercises={getGrammarExercises(lesson.id)}
                    scores={scores}
                  />
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Mobile tab strip */}
            <div
              className="lg:hidden overflow-x-auto -mx-4 px-4 pb-4 mb-8"
              aria-label="Jump to topic"
            >
              <div className="flex gap-2 w-max" role="list">
                {grammarLessons.map((lesson) => {
                  const exs = getGrammarExercises(lesson.id);
                  const { completed, total } = calcProgress(exs, scores);
                  return (
                    <a
                      key={lesson.id}
                      href={`#topic-${lesson.id}`}
                      role="listitem"
                      className="whitespace-nowrap px-3 py-1.5 text-sm rounded-full border border-gray-200 text-[#1F2937] hover:bg-[#F5EFE6] hover:border-[#1E40AF]/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
                    >
                      {lesson.title}
                      {completed > 0 && (
                        <span className="ml-1.5 text-xs font-semibold text-[#16A34A]">
                          {completed}/{total}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Topic sections */}
            <div className="flex flex-col gap-16">
              {grammarLessons.map((lesson) => {
                const grammarExercises = getGrammarExercises(lesson.id);
                return (
                  <section
                    key={lesson.id}
                    id={`topic-${lesson.id}`}
                    aria-labelledby={`heading-${lesson.id}`}
                    className="scroll-mt-6"
                  >
                    {/* Topic header */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          LEVEL_COLORS[lesson.level]
                        }`}
                      >
                        {lesson.level}
                      </span>
                      <h2
                        id={`heading-${lesson.id}`}
                        className="text-2xl font-bold text-[#1F2937]"
                      >
                        {lesson.title}
                      </h2>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="ml-auto text-xs text-[#1E40AF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded"
                      >
                        Full lesson →
                      </Link>
                    </div>

                    {/* Progress bar */}
                    <TopicProgressBar
                      exercises={grammarExercises}
                      scores={scores}
                    />

                    {/* Explanation */}
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Explanation
                      </h3>
                      <p className="text-[#1F2937] leading-relaxed">
                        {lesson.explanation}
                      </p>
                    </div>

                    {/* Common mistakes */}
                    {lesson.common_mistakes.length > 0 && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <h3 className="text-xs font-bold text-[#D62828] uppercase tracking-widest mb-2">
                          Common Mistakes
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {lesson.common_mistakes.map((mistake, i) => (
                            <li
                              key={i}
                              className="text-sm text-[#1F2937] leading-relaxed"
                            >
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Examples with audio */}
                    {lesson.examples.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                          Examples
                        </h3>
                        <div className="flex flex-col gap-3">
                          {lesson.examples.map((example, i) => (
                            <div
                              key={i}
                              className="flex items-start justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100"
                            >
                              <div>
                                <p className="font-semibold text-[#1F2937]">
                                  {example.french}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {example.english}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <AudioButton
                                  text={example.french}
                                  label="Play"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grammar exercises */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Exercises
                      </h3>
                      {grammarExercises.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No grammar exercises for this topic yet.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {grammarExercises.map((exercise, i) => (
                            <ExerciseCard
                              key={exercise.id}
                              exercise={exercise}
                              index={i}
                              onComplete={refreshScores}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="mt-16 rounded-2xl bg-[#F5EFE6] p-6 text-sm text-[#1F2937]">
              <p className="font-semibold mb-1">More grammar topics are planned</p>
              <p className="text-gray-600">
                A2 and B1 grammar — past tense, subjunctive, conditional, and
                connectors — will be added in upcoming lessons.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
