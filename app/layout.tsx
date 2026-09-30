import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Type refresh is the highest-value, lowest-risk redesign lever (skill 11.D.1).
   Plex was carrying the whole UI as both text and data face. Splitting it:
   Geist for text, Geist Mono reserved for the instrument layer (coordinates,
   scores, counts, timestamps) where a monospace figure is a functional
   requirement rather than a style choice. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAFEGRID - AI-Powered Preventive Safety",
  description:
    "From emergency response to preventive safety. SAFEGRID keeps you safe during night travel, isolated journeys and emergencies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
