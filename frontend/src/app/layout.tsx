import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetPulse | AI Meeting Notes Generator',
  description: 'Transform your meeting transcripts into actionable insights with AI-powered analysis and generator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        <Navbar />
        <main>{children}</main>

        {/* Simple Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MeetPulse. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
