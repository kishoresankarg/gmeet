import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Cursor } from '@/components/Cursor';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'MeetPulse | AI Insights',
  description: 'Transform your meetings into actionable insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&family=Unbounded:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        <Navbar />
        {children}
        <footer>
          <div className="footer-logo">MEET<span>.</span>PULSE</div>
          <span className="footer-copy">© {new Date().getFullYear()} MeetPulse — AI Insights</span>
          <ul className="footer-links">
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Issues</a></li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
