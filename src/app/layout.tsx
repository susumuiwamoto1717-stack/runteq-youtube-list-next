import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube List - RUNTEQ",
  description: "RUNTEQ公式YouTubeチャンネルの動画を自動追跡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
            <Link
              href="/"
              className="text-orange-500 font-bold text-xl tracking-tight hover:text-orange-600 transition"
            >
              RUNTEQ
            </Link>
            <div className="flex items-center gap-1">
              <NavLink href="/videos">📺 YouTube List</NavLink>
              <NavLink href="/questions">💬 Q&A</NavLink>
              <NavLink href="/how-it-works">⚙ 仕組み解説</NavLink>
            </div>
            <a
              href="https://notebooklm.google.com/notebook/ed2ce43e-49be-439d-9c9e-6ba01fe550b2"
              target="_blank"
              rel="noopener"
              className="text-sm text-gray-500 hover:text-orange-600 transition flex items-center gap-1"
            >
              📓 NotebookLM
            </a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-400 text-center py-3 text-xs">
          YouTube List — RUNTEQ 学習プロジェクト
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition"
    >
      {children}
    </Link>
  );
}
