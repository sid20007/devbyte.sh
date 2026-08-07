import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Master & Academic Profile",
  description: "University student information management system and academic dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t py-4 text-center text-xs text-muted-foreground">
            Student Master & Academic Profile &copy; {new Date().getFullYear()} — Hackathon MVP
          </footer>
        </div>
      </body>
    </html>
  );
}
