import React from 'react';
import { Search, Calendar, ArrowUpDown } from 'lucide-react';

interface TranscriptSearchProps {
  onSearch: (query: string) => void;
  onDateFilter: (fromDate: string, toDate: string) => void;
  onSort: (sortBy: 'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc') => void;
  searchQuery?: string;
  sortBy?: string;
}

export const TranscriptSearch: React.FC<TranscriptSearchProps> = ({
  onSearch,
  onDateFilter,
  onSort,
  searchQuery = '',
  sortBy = 'date-newest',
}) => {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const handleDateChange = () => {
    onDateFilter(fromDate, toDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Search & Filter</h3>

      {/* Search Input */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Search className="w-4 h-4 inline mr-2" />
          Search Transcripts
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by title, content, or summary..."
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
        />
      </div>

      {/* Date Range Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Date Range
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            placeholder="From date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            placeholder="To date"
          />
          <button
            onClick={handleDateChange}
            className="px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <ArrowUpDown className="w-4 h-4 inline mr-2" />
          Sort By
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onSort('date-newest')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'date-newest'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Newest
          </button>
          <button
            onClick={() => onSort('date-oldest')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'date-oldest'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Oldest
          </button>
          <button
            onClick={() => onSort('title-asc')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'title-asc'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Title A-Z
          </button>
          <button
            onClick={() => onSort('title-desc')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'title-desc'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Title Z-A
          </button>
        </div>
      </div>
    </div>
  );
};
