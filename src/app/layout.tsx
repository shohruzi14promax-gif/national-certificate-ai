import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "National Certificate AI",
  description: "AI-powered preparation for Uzbekistan National Certificate exams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
