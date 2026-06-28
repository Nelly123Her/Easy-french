import { notFound } from "next/navigation";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import AudioButton from "@/components/AudioButton";
import PronunciationBlock from "@/components/PronunciationBlock";
import ConversationPlayer from "@/components/ConversationPlayer";
import LessonCompleteButton from "@/components/LessonCompleteButton";
import ExerciseCard from "@/components/ExerciseCard";

export async function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return { title: "Lesson not found — Easy French Lab" };
  return {
    title: `${lesson.title} — Easy French Lab`,
    description: `Learn ${lesson.title} in French. ${lesson.summary}`,
  };
}

const LEVEL_COLORS: Record<string, string> = {
  A0: "bg-[#1E40AF] text-white",
  A1: "bg-[#1E40AF] text-white",
  A2: "bg-[#D62828] text-white",
  B1: "bg-[#1F2937] text-white",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-[#16A34A]",
  Medium: "bg-yellow-100 text-[#F59E0B]",
  Hard: "bg-red-100 text-[#D62828]",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson) notFound();

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/lessons"
            className="text-sm text-[#1E40AF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded"
          >
            ← Back to Lessons
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${LEVEL_COLORS[lesson.level]}`}
            >
              {lesson.level}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {lesson.category}
            </span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${DIFFICULTY_COLORS[lesson.difficulty]}`}
            >
              {lesson.difficulty}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {lesson.estimated_minutes} min
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] leading-tight">
            {lesson.title}
          </h1>
        </header>

        {/* Objectives */}
        <section className="mb-10" aria-labelledby="objectives-heading">
          <h2
            id="objectives-heading"
            className="text-lg font-bold text-[#1F2937] mb-4"
          >
            What you will learn
          </h2>
          <ul className="flex flex-col gap-2" role="list">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-[#1F2937]">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1E40AF] shrink-0"
                  aria-hidden
                />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* Explanation */}
        <section className="mb-10" aria-labelledby="explanation-heading">
          <h2
            id="explanation-heading"
            className="text-lg font-bold text-[#1F2937] mb-4"
          >
            Explanation
          </h2>
          <p className="text-[#1F2937] leading-relaxed">{lesson.explanation}</p>
        </section>

        {/* Pronunciation */}
        {lesson.pronunciation_items.length > 0 && (
          <section className="mb-10" aria-labelledby="pronunciation-heading">
            <h2
              id="pronunciation-heading"
              className="text-lg font-bold text-[#1F2937] mb-4"
            >
              Pronunciation
            </h2>
            <PronunciationBlock items={lesson.pronunciation_items} />
          </section>
        )}

        {/* Examples */}
        {lesson.examples.length > 0 && (
          <section className="mb-10" aria-labelledby="examples-heading">
            <h2
              id="examples-heading"
              className="text-lg font-bold text-[#1F2937] mb-4"
            >
              Examples
            </h2>
            <div className="flex flex-col gap-3">
              {lesson.examples.map((ex, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1F2937]">
                        {ex.french}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{ex.english}</p>
                    </div>
                    <div className="shrink-0">
                      <AudioButton text={ex.french} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Native Speaker Notes */}
        {lesson.native_notes.length > 0 && (
          <section className="mb-10" aria-labelledby="native-notes-heading">
            <h2
              id="native-notes-heading"
              className="text-lg font-bold text-[#1F2937] mb-4"
            >
              Native Speaker Notes
            </h2>
            <div className="bg-[#1E40AF]/5 border border-[#1E40AF]/20 rounded-2xl p-5 flex flex-col gap-3">
              {lesson.native_notes.map((note, i) => (
                <p key={i} className="text-[#1F2937] leading-relaxed text-sm">
                  {note}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        {lesson.common_mistakes.length > 0 && (
          <section className="mb-10" aria-labelledby="mistakes-heading">
            <h2
              id="mistakes-heading"
              className="text-lg font-bold text-[#1F2937] mb-4"
            >
              Common Mistakes
            </h2>
            <div className="bg-[#D62828]/5 border border-[#D62828]/20 rounded-2xl p-5 flex flex-col gap-3">
              {lesson.common_mistakes.map((mistake, i) => (
                <p key={i} className="text-[#1F2937] leading-relaxed text-sm">
                  {mistake}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Conversation */}
        {lesson.conversation.length > 0 && (
          <section className="mb-10" aria-labelledby="conversation-heading">
            <span id="conversation-heading" className="sr-only">
              Conversation
            </span>
            <ConversationPlayer lines={lesson.conversation} />
          </section>
        )}

        {/* Exercises */}
        {lesson.exercises.length > 0 && (
          <section className="mb-10" aria-labelledby="exercises-heading">
            <h2
              id="exercises-heading"
              className="text-lg font-bold text-[#1F2937] mb-4"
            >
              Practice Exercises
            </h2>
            <div className="flex flex-col gap-4">
              {lesson.exercises.map((exercise, i) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
              ))}
            </div>
          </section>
        )}

        <hr className="border-gray-100 mb-10" />

        {/* Summary */}
        <section className="mb-10" aria-labelledby="summary-heading">
          <div className="bg-[#F5EFE6] rounded-2xl p-6">
            <h2
              id="summary-heading"
              className="text-base font-bold text-[#1F2937] mb-2 uppercase tracking-widest"
            >
              Lesson Summary
            </h2>
            <p className="text-[#1F2937] leading-relaxed">{lesson.summary}</p>
          </div>
        </section>

        {/* Mark complete + Next lesson */}
        <section aria-label="Lesson progress">
          <LessonCompleteButton
            lessonId={lesson.id}
            nextLessonId={lesson.next_lesson_id}
          />
        </section>
      </div>
    </div>
  );
}
