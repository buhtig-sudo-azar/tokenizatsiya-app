import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle, ThemeScript } from "@/components/learn/theme-toggle";
import { ScrollToTopBrain } from "@/components/learn/scroll-to-top";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Токенизация — как машины читают текст",
  description:
    "Интерактивное приложение: разберитесь, как текст превращается в токены и числа, которыми оперируют языковые модели. 9 модулей с живой песочницей BPE, WordPiece, спецтокенов.",
  keywords: [
    "токенизация",
    "токены",
    "BPE",
    "WordPiece",
    "NLP",
    "языковые модели",
    "GPT",
    "BERT",
    "интерактивный курс",
  ],
  authors: [{ name: "Токенизация" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "Токенизация — как машины читают текст",
    description:
      "9 модулей с живой песочницей: BPE, WordPiece, спецтокены, ID токенов.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeToggle />
        {children}
        <ScrollToTopBrain />
      </body>
    </html>
  );
}
