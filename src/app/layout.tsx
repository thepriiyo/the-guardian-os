import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shield } from "lucide-react";
import Link from 'next/link';
import Scene from "@/components/canvas/Scene";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Guardian | AI Career Survival System",
  description: "Diagnostic career risk analysis and structured pivot roadmaps for the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#020617] h-full`}
      >
        <Script id="scroll-restoration" strategy="afterInteractive">
          {`history.scrollRestoration = "manual"`}
        </Script>
        <Script 
          src="https://app.lemonsqueezy.com/js/lemon.js" 
          strategy="afterInteractive"
        />
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Scene />
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="font-black tracking-tighter text-xl uppercase italic">THE GUARDIAN</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/dashboard" className="hover:text-blue-500 transition-colors">Tactical HUD</Link>
              <Link href="/dashboard/roadmap" className="hover:text-blue-500 transition-colors">Roadmap</Link>
              <Link href="/dashboard/pulse" className="hover:text-blue-500 transition-colors">Market Pulse</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="text-[10px] px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono uppercase tracking-widest">
                GUARDIAN_OS v1.2
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/5 py-12 bg-black/60 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-4 text-center text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 text-white">
            &copy; 2026 THE_GUARDIAN // AI_CAREER_SURVIVAL_ENGINE
          </div>
        </footer>
      </body>
    </html>
  );
}
