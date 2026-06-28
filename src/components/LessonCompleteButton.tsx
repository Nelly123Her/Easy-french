"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";

interface LessonCompleteButtonProps {
  lessonId: string;
  nextLessonId: string | null;
}

const STORAGE_KEY = "efl_completed_lessons";

export default function LessonCompleteButton({
  lessonId,
  nextLessonId,
}: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setCompleted((parsed as string[]).includes(lessonId));
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, [lessonId]);

  function markComplete() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: string[] = raw
        ? (JSON.parse(raw) as string[])
        : [];
      if (!parsed.includes(lessonId)) {
        parsed.push(lessonId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      setCompleted(true);
    } catch {
      // localStorage unavailable
    }
  }

  const nextLesson = nextLessonId
    ? lessons.find((l) => l.id === nextLessonId)
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {completed ? (
        <span className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-[#16A34A] font-semibold rounded-xl border border-green-200 text-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 8l3.5 3.5L13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Lesson Complete
        </span>
      ) : (
        <button
          onClick={markComplete}
          className="px-6 py-3 bg-[#16A34A] text-white font-semibold rounded-xl hover:bg-[#16A34A]/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] text-sm"
        >
          Mark as Complete
        </button>
      )}

      {nextLesson && (
        <Link
          href={`/lessons/${nextLesson.slug}`}
          className="px-6 py-3 bg-[#1E40AF] text-white font-semibold rounded-xl hover:bg-[#1E40AF]/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] text-sm"
        >
          Next: {nextLesson.title} →
        </Link>
      )}
    </div>
  );
}
