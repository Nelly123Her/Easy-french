import Link from 'next/link';
import type { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
}

const levelColors: Record<string, string> = {
  A0: 'bg-[#1E40AF] text-white',
  A1: 'bg-[#1E40AF] text-white',
  A2: 'bg-[#D62828] text-white',
  B1: 'bg-[#1F2937] text-white',
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-100 text-[#16A34A]',
  Medium: 'bg-yellow-100 text-[#F59E0B]',
  Hard: 'bg-red-100 text-[#D62828]',
};

export default function LessonCard({ lesson, completed }: LessonCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColors[lesson.level]}`}>
            {lesson.level}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {lesson.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[lesson.difficulty]}`}>
            {lesson.difficulty}
          </span>
        </div>

        <h3 className="font-semibold text-[#1F2937] leading-snug text-base">
          {lesson.title}
        </h3>

        <p className="text-sm text-gray-500">{lesson.estimated_minutes} min</p>

        {completed && (
          <p className="text-sm font-medium text-[#16A34A]">Completed</p>
        )}
      </div>

      <div className="px-5 pb-5">
        <Link
          href={`/lessons/${lesson.slug}`}
          className="block w-full text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
        >
          {completed ? 'Continue' : 'Start Lesson'}
        </Link>
      </div>
    </div>
  );
}
