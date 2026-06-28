import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard — Easy French Lab",
};

export default function Page() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-5xl mb-6" aria-hidden>📊</div>
      <h1 className="text-3xl font-bold text-[#1F2937] mb-3">Dashboard</h1>
      <p className="text-gray-500 max-w-md mb-8">See your progress: lessons completed, exercise accuracy, streak, and next steps. Coming next.</p>
      <Link href="/" className={buttonVariants({ variant: "outline" }) + " border-[#1E40AF] text-[#1E40AF] hover:bg-[#F5EFE6]"}>
        ← Back to Home
      </Link>
    </div>
  );
}
