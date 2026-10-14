import React from 'react';
import { Home, FlaskConical } from 'lucide-react';
import type { Page } from './Sidebar';

interface TopNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const pageTitles: Record<Page, string> = {
  overview: 'Overview',
  predict: 'Predict Customer',
  insights: 'Dataset Insights',
  performance: 'Model Performance',
  about: 'About Project',
};

const TopNav: React.FC<TopNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-navy font-bold text-lg">{pageTitles[currentPage]}</h1>
      </div>

      {/* Right: badges + home */}
      <div className="flex items-center gap-3">
        {/* Demo mode badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <FlaskConical size={12} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 tracking-wide">DEMO MODE</span>
        </div>

        {/* ML Lab badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-blue-600 tracking-wide">ML LAB MINI PROJECT</span>
        </div>

        {/* Home button */}
        {currentPage !== 'overview' && (
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-navy bg-ice border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Overview</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopNav;
