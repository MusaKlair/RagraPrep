import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ragra Prep - AI-Powered Preparation Platform",
  description: "AI-powered preparation platform for students. Master your exams with intelligent study tools and personalized learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: 'border-emerald-500/20 bg-white text-emerald-600',
              error: 'border-red-500/20 bg-white text-red-600',
              toast: 'font-mono text-[11px] uppercase tracking-widest bg-white border border-neutral-200 rounded-none shadow-xl',
            },
            style: {
              borderRadius: '0px',
            }
          }}
        />
      </body>
    </html>
  );
}
