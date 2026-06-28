"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Search } from "lucide-react";

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
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    if (q.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
    }
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8] border-b border-gray-200">
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 h-16"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-[#1E40AF] shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded"
          aria-label="Easy French Lab — Home"
        >
          <span aria-hidden>🇫🇷</span>
          Easy French Lab
        </Link>

        <ul className="hidden md:flex items-center gap-1 flex-1" role="list">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
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

        {/* Desktop search */}
        <div className="hidden md:flex items-center ml-auto">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} role="search" aria-label="Site search">
              <label htmlFor="nav-search" className="sr-only">Search</label>
              <div className="flex items-center gap-1">
                <input
                  id="nav-search"
                  ref={inputRef}
                  name="q"
                  type="search"
                  placeholder="Search..."
                  autoComplete="off"
                  onBlur={() => setSearchOpen(false)}
                  className="w-44 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-[#1F2937] placeholder-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="p-1.5 rounded-lg text-[#1E40AF] hover:bg-[#F5EFE6] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
                >
                  <Search size={16} aria-hidden />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="p-2 rounded-lg text-gray-500 hover:text-[#1E40AF] hover:bg-[#F5EFE6] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <Search size={18} aria-hidden />
            </button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2 ml-auto text-sm">
          <Link href="/lessons" className="font-medium text-[#1E40AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded px-1">Learn</Link>
          <Link href="/practice" className="font-medium text-[#1E40AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded px-1">Practice</Link>
          <Link href="/search" aria-label="Search" className="p-1.5 text-gray-500 hover:text-[#1E40AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] rounded">
            <Search size={18} aria-hidden />
          </Link>
        </div>
      </nav>
    </header>
  );
}
