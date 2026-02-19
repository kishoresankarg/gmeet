import React from 'react';
import { Menu, X, Home, History, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">📝</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Meeting Notes</h1>
              <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Analysis</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex gap-6">
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm">
              <Home className="w-4 h-4" />
              Home
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm">
              <History className="w-4 h-4" />
              History
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mt-3 sm:mt-4 lg:hidden flex flex-col gap-2">
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm hover:text-blue-600 transition">
              Home
            </a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm hover:text-blue-600 transition">
              History
            </a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm hover:text-blue-600 transition">
              Settings
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
