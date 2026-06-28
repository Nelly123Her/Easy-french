'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import AudioButton from './AudioButton';
import type { VocabularyItem } from '@/types';

interface VocabularyCardProps {
  item: VocabularyItem;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

const genderLabel: Record<string, string> = {
  masculine: 'm.',
  feminine: 'f.',
};

const genderColors: Record<string, string> = {
  masculine: 'bg-blue-50 text-blue-600 border-blue-200',
  feminine: 'bg-pink-50 text-pink-600 border-pink-200',
};

export default function VocabularyCard({ item, saved, onToggleSave }: VocabularyCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* French word + gender + part of speech */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span lang="fr" className="text-2xl font-bold text-[#1F2937]">{item.french}</span>
            {item.gender && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${genderColors[item.gender]}`}>
                {genderLabel[item.gender]}
              </span>
            )}
            <span className="text-xs font-medium text-gray-400">{item.part_of_speech}</span>
          </div>
          <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5EFE6] text-[#1E40AF]">
            {item.level}
          </span>
        </div>

        {/* English meaning */}
        <p className="text-base font-semibold text-gray-700">{item.english}</p>

        {/* Pronunciation */}
        <p className="text-sm text-gray-400 italic">{item.pronunciation_hint}</p>
        {item.ipa && (
          <p className="text-xs text-gray-400 font-mono">[{item.ipa}]</p>
        )}

        {/* Example */}
        <div className="bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl p-3 text-sm">
          <p lang="fr" className="text-[#1F2937] font-medium">{item.example_sentence}</p>
          <p className="text-gray-500 mt-1">{item.example_translation}</p>
        </div>

        {/* Memory tip */}
        {item.memory_tip && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            <span className="font-semibold">Tip: </span>{item.memory_tip}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-2 flex-wrap">
        <AudioButton text={item.french} label="Play" />
        <AudioButton text={item.french} rate={0.7} label="Play slow" />
        <button
          onClick={() => onToggleSave(item.id)}
          aria-label={saved ? `Remove ${item.french} from saved` : `Save ${item.french} to review`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ml-auto ${
            saved
              ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
              : 'text-gray-500 border-gray-200 hover:border-[#1E40AF] hover:text-[#1E40AF]'
          }`}
        >
          {saved ? <BookmarkCheck size={14} aria-hidden /> : <Bookmark size={14} aria-hidden />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
