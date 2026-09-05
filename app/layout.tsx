import type { Metadata } from 'next';
import '../src/app/globals.css';
import '../src/app/premium.css';
import './theme.css';

export const metadata: Metadata = {
  title: 'MilliyTest',
  description: 'O‘zbekiston Milliy sertifikat imtihonlariga tayyorgarlik platformasi.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
