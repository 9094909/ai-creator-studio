import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Creator Studio',
  description: 'Create amazing content with AI-powered tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
