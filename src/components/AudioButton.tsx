"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioButtonProps {
  text: string;
  lang?: string;
  rate?: number;
  label?: string;
}

export default function AudioButton({
  text,
  lang = "fr-FR",
  rate = 1.0,
  label,
}: AudioButtonProps) {
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  function speak() {
    if (!supported || playing) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.onstart = () => setPlaying(true);
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  const buttonLabel = label ?? (rate < 1 ? "Play slow" : "Play audio");

  return (
    <button
      onClick={speak}
      disabled={!supported || playing}
      aria-label={`${buttonLabel}: ${text}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
        !supported
          ? "text-gray-400 border-gray-200 cursor-not-allowed"
          : playing
          ? "bg-[#1E40AF] text-white border-[#1E40AF]"
          : "text-[#1E40AF] border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
      }`}
    >
      {supported ? (
        <Volume2 size={14} aria-hidden />
      ) : (
        <VolumeX size={14} aria-hidden />
      )}
      {buttonLabel}
    </button>
  );
}
