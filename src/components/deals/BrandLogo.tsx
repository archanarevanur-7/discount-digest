"use client";

import { useState } from "react";
import Image from "next/image";

interface BrandLogoProps {
  domain: string;
  emoji: string;
  brand: string;
}

export default function BrandLogo({ domain, emoji, brand }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-3xl" aria-label={brand}>
        {emoji}
      </span>
    );
  }

  return (
    <Image
      src={`https://logo.clearbit.com/${domain}`}
      alt={brand}
      width={40}
      height={40}
      className="w-10 h-10 rounded-lg object-contain"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
