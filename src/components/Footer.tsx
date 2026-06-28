import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#1E40AF]">
            <span>🇫🇷</span>
            Easy French Lab
          </div>
          <p className="text-sm text-gray-500">
            Learn French naturally — pronunciation, grammar, and real expressions.
          </p>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/lessons" className="hover:text-[#1E40AF] transition-colors">Lessons</Link>
            <Link href="/pronunciation" className="hover:text-[#1E40AF] transition-colors">Pronunciation</Link>
            <Link href="/expressions" className="hover:text-[#1E40AF] transition-colors">Expressions</Link>
            <Link href="/dashboard" className="hover:text-[#1E40AF] transition-colors">Dashboard</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Easy French Lab. Built for English speakers learning French.
        </p>
      </div>
    </footer>
  );
}
