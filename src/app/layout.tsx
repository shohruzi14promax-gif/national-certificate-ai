import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./brand.css";
import "./motion.css";

export const metadata: Metadata = {
  title: "MilliyTest",
  description: "O‘zbekiston Milliy sertifikat imtihonlariga tayyorgarlik platformasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
