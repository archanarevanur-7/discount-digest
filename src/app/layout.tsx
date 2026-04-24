import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Discount Digest — Student & Grad Deals",
  description:
    "Free service helping grad students and working professionals discover and claim every discount they qualify for. Stop overpaying for tools you already have access to for free.",
  openGraph: {
    title: "Discount Digest — Student & Grad Deals",
    description:
      "The average working grad student overpays $1,764/year. We'll show you exactly where your money is going.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
