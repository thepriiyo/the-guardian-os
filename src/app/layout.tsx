import type { Metadata, Viewport } from "next";
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
  title: "The Guardian OS // 2026 AI Career Survival & Risk Analysis",
  description: "Protect your professional future from the curve of AI automation. Get high-density tactical roadmaps, real-time 2026 market intelligence, and stylized career survival dossiers engineered by Priiyo.",
  keywords: ["AI Career Risk", "Job Automation 2026", "Career Pivot Strategy", "Google Gemma 3", "Tactical Dossier", "Career Resilience", "Priiyo"],
  authors: [{ name: "Priiyo", url: "https://the-guardian-os.vercel.app" }],
  openGraph: {
    title: "The Guardian OS // Career Automation Defense",
    description: "Initialize your tactical career scan. Survive the 2026 AI shift.",
    url: "https://the-guardian-os.vercel.app",
    siteName: "The Guardian OS",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "The Guardian OS: Tactical Intelligence HUD",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Guardian OS // 2026 AI Survival",
    description: "A high-performance diagnostic engine protecting your human delta.",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#020617] overflow-x-hidden`}
      >
        <Script id="scroll-restoration" strategy="afterInteractive">
          {`history.scrollRestoration = "manual"`}
        </Script>
        <Script 
          src="https://app.lemonsqueezy.com/js/lemon.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "The Guardian OS",
              "url": "https://the-guardian-os.vercel.app",
              "description": "A high-performance AI diagnostic engine that analyzes career automation risk and generates tactical 12-week survival roadmaps for the 2026 labor market.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "2.49",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Priiyo"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "127"
              }
            })
          }}
        />
        <Scene />
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="font-black tracking-tighter text-xl uppercase italic">THE GUARDIAN</span>
            </Link>
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
