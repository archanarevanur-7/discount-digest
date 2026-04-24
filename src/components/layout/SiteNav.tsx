"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-zinc-100 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Discount Digest
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/deals" className="hover:text-zinc-900 transition-colors">
            Browse Deals
          </Link>
          <Link href="/audit" className="hover:text-zinc-900 transition-colors">
            Life Audit
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/audit" className="sm:hidden text-sm text-zinc-600 hover:text-zinc-900">
            Audit
          </Link>
          <Button asChild size="sm">
            <Link href="/#email-capture">Get my deals</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
