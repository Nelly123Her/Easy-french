"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Learn", href: "/lessons" },
  { label: "Pronunciation", href: "/pronunciation" },
  { label: "Grammar", href: "/grammar" },
  { label: "Vocabulary", href: "/vocabulary" },
  { label: "Expressions", href: "/expressions" },
  { label: "Practice", href: "/practice" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8] border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#1E40AF]">
          <span>🇫🇷</span>
          Easy French Lab
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#1E40AF] text-white"
                      : "text-[#1F2937] hover:bg-[#F5EFE6] hover:text-[#1E40AF]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="md:hidden flex items-center gap-3 text-sm">
          <Link href="/lessons" className="font-medium text-[#1E40AF]">Learn</Link>
          <Link href="/practice" className="font-medium text-[#1E40AF]">Practice</Link>
          <Link href="/dashboard" className="font-medium text-[#1E40AF]">Dashboard</Link>
        </div>
      </nav>
    </header>
  );
}
