import Link from "next/link";
import AudioButton from "@/components/AudioButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    icon: "🎧",
    title: "Pronunciation Made Simple",
    description: "Hear every word and phrase in natural French with normal and slow-speed audio.",
  },
  {
    icon: "📝",
    title: "Grammar with Exercises",
    description: "Clear rules, real examples, and instant-feedback practice in every lesson.",
  },
  {
    icon: "💬",
    title: "Native French Expressions",
    description: "Learn what French speakers actually say — not just what textbooks teach.",
  },
  {
    icon: "🌍",
    title: "Real-Life Examples",
    description: "Every lesson is grounded in everyday situations: coffee shops, travel, work.",
  },
  {
    icon: "📅",
    title: "Daily Practice Path",
    description: "Five, ten, or fifteen minutes a day — a focused session built around your weak spots.",
  },
];

const levels = [
  {
    code: "A0",
    label: "Absolute Beginner",
    color: "bg-[#F5EFE6] text-[#1E40AF] border-[#1E40AF]",
    topics: ["French alphabet and sounds", "Greetings and numbers", "Basic verbs and gender of nouns"],
  },
  {
    code: "A1",
    label: "Beginner",
    color: "bg-[#1E40AF] text-white border-[#1E40AF]",
    topics: ["Introducing yourself", "Ordering food and travel basics", "Present tense and articles"],
  },
  {
    code: "A2",
    label: "Elementary",
    color: "bg-[#D62828] text-white border-[#D62828]",
    topics: ["Past and future tense", "Shopping and work vocabulary", "Native expressions and pronouns"],
  },
  {
    code: "B1",
    label: "Lower Intermediate",
    color: "bg-[#1F2937] text-white border-[#1F2937]",
    topics: ["Complex conversations and storytelling", "Subjunctive and conditional", "French connectors and idioms"],
  },
];

const sampleConversation = [
  { fr: "Bonjour ! Comment ça va ?", en: "Hello! How are you?" },
  { fr: "Ça va bien, merci. Et toi ?", en: "I'm doing well, thanks. And you?" },
  { fr: "Très bien, merci !", en: "Very well, thanks!" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#FFFDF8] py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#F5EFE6] text-[#D62828] text-sm font-semibold px-4 py-1 rounded-full mb-6">
            Free · No account needed · Start now
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6">
            Learn French naturally, with pronunciation, examples, and real practice.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Simple lessons, native expressions, grammar exercises, and daily French practice for English speakers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons" className={buttonVariants({ size: "lg" }) + " bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white px-8 py-3 text-base"}>
              Start Learning
            </Link>
            <Link href="/pronunciation" className={buttonVariants({ variant: "outline", size: "lg" }) + " border-[#1E40AF] text-[#1E40AF] hover:bg-[#F5EFE6] px-8 py-3 text-base"}>
              Try Pronunciation Practice
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1F2937] mb-10">
            Everything you need to speak French confidently
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="bg-[#F5EFE6] border-0 rounded-2xl">
                <CardContent className="p-6 flex flex-col gap-3">
                  <span className="text-3xl" aria-hidden>{f.icon}</span>
                  <h3 className="font-semibold text-[#1F2937] leading-snug">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample lesson preview */}
      <section className="bg-[#FFFDF8] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1F2937] mb-3">
            See how a lesson feels
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Every lesson includes pronunciation, audio, and real conversation examples.
          </p>

          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Lesson header */}
              <div className="bg-[#1E40AF] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Sample Lesson · A0</div>
                  <h3 className="text-lg font-bold">Saying Bonjour naturally</h3>
                </div>
                <Badge className="bg-white/20 text-white border-0 text-xs">~5 min</Badge>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* Phrase */}
                <div className="bg-[#F5EFE6] rounded-xl p-5">
                  <p className="text-2xl font-bold text-[#1F2937] mb-1">Bonjour, comment ça va ?</p>
                  <p className="text-gray-500 mb-3">Hello, how are you?</p>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium text-[#1E40AF]">Pronunciation:</span>{" "}
                    bohn-zhoor, koh-mahn sah vah
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <AudioButton text="Bonjour, comment ça va ?" label="Play normal" />
                    <AudioButton text="Bonjour, comment ça va ?" rate={0.6} label="Play slow" />
                  </div>
                </div>

                {/* Conversation */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Example conversation</p>
                  <div className="space-y-3">
                    {sampleConversation.map((line, i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1F2937]">{line.fr}</span>
                          <AudioButton text={line.fr} label="Play" />
                        </div>
                        <span className="text-xs text-gray-400 ml-0.5">{line.en}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Native note */}
                <div className="border-l-4 border-[#D62828] bg-red-50 rounded-r-xl px-4 py-3">
                  <p className="text-xs font-semibold text-[#D62828] uppercase tracking-wide mb-1">Native note</p>
                  <p className="text-sm text-[#1F2937]">
                    In France, always say <strong>Bonjour</strong> before asking for anything — in a shop, restaurant, or office. Skipping it can come across as rude.
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/lessons" className={buttonVariants() + " bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white"}>
                    Browse all lessons →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning path preview */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1F2937] mb-3">
            Your path from zero to conversational
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Four structured levels, built around real situations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level) => (
              <Card key={level.code} className="rounded-2xl border border-gray-100 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <Badge className={`${level.color} border font-bold text-sm px-3 py-1`}>
                    {level.code}
                  </Badge>
                  <p className="font-semibold text-[#1F2937]">{level.label}</p>
                  <ul className="space-y-1.5">
                    {level.topics.map((t) => (
                      <li key={t} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#16A34A] mt-0.5" aria-hidden>✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1E40AF] py-16 px-4 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Start your first 10-minute French lesson.
        </h2>
        <p className="text-blue-200 mb-8 max-w-md mx-auto">
          No account. No payment. Just clear, practical French — right now.
        </p>
        <Link href="/lessons" className={buttonVariants({ size: "lg" }) + " bg-white text-[#1E40AF] hover:bg-blue-50 font-semibold px-10 py-3 text-base"}>
          Get Started Free →
        </Link>
      </section>
    </div>
  );
}
