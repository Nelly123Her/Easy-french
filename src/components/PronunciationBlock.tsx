"use client";

import AudioButton from "./AudioButton";
import type { PronunciationItem } from "@/types";

interface PronunciationBlockProps {
  items: PronunciationItem[];
}

export default function PronunciationBlock({ items }: PronunciationBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-[#F5EFE6] rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-xl font-bold text-[#1F2937] leading-tight">
              {item.french}
            </p>
            <div className="flex gap-2 shrink-0">
              <AudioButton text={item.french} label="Play" />
              <AudioButton text={item.french} rate={0.6} label="Slow" />
            </div>
          </div>

          <p className="text-gray-600 text-sm">{item.english}</p>

          {item.pronunciation_hint && (
            <p className="text-sm text-[#1E40AF] font-medium">
              Pronunciation: {item.pronunciation_hint}
            </p>
          )}

          {item.ipa && (
            <p className="text-xs text-gray-400 font-mono">
              IPA: [{item.ipa}]
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
