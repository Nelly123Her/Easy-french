interface FeedbackBoxProps {
  state: "correct" | "incorrect" | "hint";
  explanation: string;
  score?: number;
}

export default function FeedbackBox({ state, explanation, score }: FeedbackBoxProps) {
  if (state === "correct") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4"
      >
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="mt-0.5 shrink-0 text-[#16A34A]"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M5.5 10l3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#16A34A] text-sm">
              Correct{score !== undefined ? ` — ${score}%` : ""}
            </p>
            <p className="mt-1 text-sm text-[#1F2937] leading-relaxed">{explanation}</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "incorrect") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="mt-0.5 shrink-0 text-[#D62828]"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M7 7l6 6M13 7l-6 6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#D62828] text-sm">Not quite — try again</p>
          </div>
        </div>
      </div>
    );
  }

  // hint state
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4"
    >
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="mt-0.5 shrink-0 text-[#F59E0B]"
        >
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 6v5M10 13.5v.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#F59E0B] text-sm">Hint</p>
          <p className="mt-1 text-sm text-[#1F2937] leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
