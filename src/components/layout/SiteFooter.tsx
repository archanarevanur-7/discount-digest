import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          Discount Digest
        </div>
        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/deals" className="hover:text-zinc-900 transition-colors">
            Browse Deals
          </Link>
          <Link href="/audit" className="hover:text-zinc-900 transition-colors">
            Life Audit
          </Link>
        </nav>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Discount Digest. Free, always.
        </p>
      </div>
    </footer>
  );
}
