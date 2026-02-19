import React from 'react';
import { Menu, X, Home, History, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meeting Notes</h1>
              <p className="text-xs text-gray-600">AI-Powered Analysis</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Home className="w-4 h-4" />
              Home
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <History className="w-4 h-4" />
              History
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden flex flex-col gap-2">
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Home
            </a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              History
            </a>
            <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Settings
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
