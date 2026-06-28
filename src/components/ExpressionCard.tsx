'use client';

import { Bookmark, BookmarkCheck, TriangleAlert } from 'lucide-react';
import AudioButton from './AudioButton';
import type { Expression } from '@/types';

interface ExpressionCardProps {
  expression: Expression;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

const formalityConfig: Record<string, { label: string; classes: string }> = {
  Formal:   { label: 'Formal',   classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  Neutral:  { label: 'Neutral',  classes: 'bg-gray-100 text-gray-600 border-gray-200' },
  Informal: { label: 'Informal', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  Slang:    { label: 'Slang',    classes: 'bg-red-50 text-red-700 border-red-200' },
};

export default function ExpressionCard({ expression, saved, onToggleSave }: ExpressionCardProps) {
  const formality = formalityConfig[expression.formality] ?? formalityConfig.Neutral;

  const dialogue = expression.example_dialogue.filter((line) => line.french !== '');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Expression + badges */}
        <div className="flex items-start justify-between gap-2">
          <span lang="fr" className="text-2xl font-bold text-[#1F2937]">{expression.expression}</span>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${formality.classes}`}>
              {formality.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5EFE6] text-[#1E40AF]">
              {expression.level}
            </span>
          </div>
        </div>

        {/* Natural meaning */}
        <p className="text-base font-semibold text-gray-700">{expression.natural_meaning}</p>

        {/* Literal translation */}
        <p className="text-sm text-gray-400 italic">Literally: {expression.literal_translation}</p>

        {/* Pronunciation hint */}
        <p className="text-sm text-gray-400">{expression.pronunciation_hint}</p>

        {/* Context */}
        <p className="text-sm text-gray-600">{expression.context}</p>

        {/* Warning */}
        {expression.warning && (
          <div className="flex gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
            <TriangleAlert size={16} className="shrink-0 mt-0.5" aria-hidden />
            <span>{expression.warning}</span>
          </div>
        )}

        {/* Example dialogue */}
        {dialogue.length > 0 && (
          <div className="bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl p-3 flex flex-col gap-2">
            {dialogue.map((line, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-bold text-[#1E40AF] shrink-0 w-4">{line.speaker}</span>
                <div>
                  <p lang="fr" className="font-medium text-[#1F2937]">{line.french}</p>
                  <p className="text-gray-500">{line.english}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-2 flex-wrap">
        <AudioButton text={expression.expression} label="Play" />
        <button
          onClick={() => onToggleSave(expression.id)}
          aria-label={saved ? `Remove "${expression.expression}" from saved` : `Save "${expression.expression}" to review`}
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
