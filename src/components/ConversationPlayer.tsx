"use client";

import { useState } from "react";
import AudioButton from "./AudioButton";
import type { ConversationLine } from "@/types";

interface ConversationPlayerProps {
  lines: ConversationLine[];
}

const SPEAKER_COLORS = [
  "text-[#1E40AF]",
  "text-[#D62828]",
  "text-[#16A34A]",
  "text-[#F59E0B]",
  "text-[#7C3AED]",
];

function getSpeakerColor(speaker: string, allSpeakers: string[]): string {
  const index = allSpeakers.indexOf(speaker);
  return SPEAKER_COLORS[index % SPEAKER_COLORS.length];
}

export default function ConversationPlayer({ lines }: ConversationPlayerProps) {
  const [bilingual, setBilingual] = useState(true);

  const speakers = Array.from(new Set(lines.map((l) => l.speaker)));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-[#1F2937]">Conversation</h2>
        <button
          onClick={() => setBilingual((prev) => !prev)}
          aria-pressed={bilingual}
          className="px-4 py-1.5 rounded-full text-sm font-semibold border border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
        >
          {bilingual ? "French only" : "Show translation"}
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {lines.map((line, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-bold mr-2 ${getSpeakerColor(line.speaker, speakers)}`}
                >
                  {line.speaker}:
                </span>
                <span lang="fr" className="text-[#1F2937] font-medium">{line.french}</span>
                {bilingual && (
                  <p className="text-sm text-gray-500 mt-1.5">{line.english}</p>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <AudioButton text={line.french} label="Play" />
                <AudioButton text={line.french} rate={0.6} label="Slow" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {lines.length > 0 && (
        <div className="bg-[#F5EFE6] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3 uppercase tracking-widest">
            Key Phrases
          </h3>
          <ul className="flex flex-col gap-2">
            {lines.slice(0, 4).map((line, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#1F2937]">
                  {line.french}
                </span>
                <AudioButton text={line.french} label="Play" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
