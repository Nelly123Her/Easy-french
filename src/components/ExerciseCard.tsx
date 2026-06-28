"use client";

import { useState, useEffect } from "react";
import type { Exercise } from "@/types";
import FeedbackBox from "@/components/FeedbackBox";
import { saveExerciseScore, getExerciseScore } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: Exercise;
  index?: number;
  onComplete?: () => void;
}

type Phase = "answering" | "incorrect" | "hint" | "done";

const DIFFICULTY_LABEL: Record<string, string> = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-green-100 text-[#16A34A]",
  Medium: "bg-yellow-100 text-[#F59E0B]",
  Hard: "bg-red-100 text-[#D62828]",
};

export default function ExerciseCard({ exercise, index, onComplete }: ExerciseCardProps) {
  const [phase, setPhase] = useState<Phase>("answering");
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = getExerciseScore(exercise.id);
    if (saved !== null) {
      setSavedScore(saved.score);
      setFinalScore(saved.score);
      setPhase("done");
    }
  }, [exercise.id]);

  function handleSelect(option: string) {
    if (phase === "done") return;
    setSelected(option);
  }

  function handleSubmit() {
    if (!selected || phase === "done") return;

    const isCorrect = selected === exercise.correct_answer;

    if (isCorrect) {
      let score = 100;
      if (attempts === 1) score = 70;
      if (attempts >= 2) score = 50;
      saveExerciseScore(exercise.id, score);
      setFinalScore(score);
      setPhase("done");
      onComplete?.();
      return;
    }

    // Wrong answer
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts === 1) {
      setPhase("incorrect");
    } else {
      // Show hint after 2nd wrong answer
      setPhase("hint");
    }
  }

  function handleSkip() {
    saveExerciseScore(exercise.id, 0);
    setFinalScore(0);
    setPhase("done");
    onComplete?.();
  }

  function handleRetry() {
    setSelected(null);
    setPhase("answering");
  }

  const isAnswering = phase === "answering" || phase === "incorrect" || phase === "hint";
  const showHint = phase === "hint";
  const isDone = phase === "done";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors",
        isDone
          ? finalScore === 0
            ? "border-gray-200 bg-white"
            : finalScore && finalScore >= 70
            ? "border-green-100 bg-green-50/30"
            : "border-yellow-100 bg-yellow-50/30"
          : "border-gray-100 bg-white shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {index !== undefined && (
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Q{index + 1}
          </span>
        )}
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            DIFFICULTY_COLOR[exercise.difficulty]
          )}
        >
          {DIFFICULTY_LABEL[exercise.difficulty]}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          {exercise.skill}
        </span>
        {isDone && finalScore !== null && (
          <span
            className={cn(
              "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
              finalScore >= 70
                ? "bg-green-100 text-[#16A34A]"
                : finalScore > 0
                ? "bg-yellow-100 text-[#F59E0B]"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {finalScore}%
          </span>
        )}
      </div>

      {/* Prompt */}
      <p className="text-[#1F2937] font-medium leading-relaxed mb-4">{exercise.prompt}</p>

      {/* Options */}
      <ul role="list" className="flex flex-col gap-2" aria-label="Answer options">
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          const isCorrectOption = option === exercise.correct_answer;

          let optionClass =
            "w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]";

          if (isDone) {
            if (isCorrectOption) {
              optionClass += " border-green-300 bg-green-50 text-[#16A34A] font-medium";
            } else if (isSelected && !isCorrectOption) {
              optionClass += " border-red-200 bg-red-50 text-[#D62828]";
            } else {
              optionClass += " border-gray-100 bg-gray-50 text-gray-400";
            }
          } else if (isSelected) {
            optionClass += " border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-medium";
          } else {
            optionClass +=
              " border-gray-200 bg-white text-[#1F2937] hover:border-[#1E40AF]/40 hover:bg-[#F5EFE6]";
          }

          return (
            <li key={option} role="listitem">
              <button
                className={optionClass}
                onClick={() => handleSelect(option)}
                disabled={isDone}
                aria-pressed={isSelected}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Feedback */}
      {phase === "incorrect" && (
        <FeedbackBox state="incorrect" explanation={exercise.explanation} />
      )}
      {showHint && (
        <FeedbackBox state="hint" explanation={exercise.explanation} />
      )}
      {isDone && (
        <FeedbackBox
          state="correct"
          explanation={exercise.explanation}
          score={finalScore ?? undefined}
        />
      )}

      {/* Actions */}
      {isAnswering && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="px-5 py-2.5 bg-[#1E40AF] text-white text-sm font-semibold rounded-xl hover:bg-[#1E40AF]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            {phase === "answering" ? "Check" : "Try Again"}
          </button>
          {phase === "incorrect" && (
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 border border-gray-200 text-[#1F2937] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSkip}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
