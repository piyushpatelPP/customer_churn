import React, { useState } from 'react';
import Sidebar, { type Page } from './components/Sidebar';
import TopNav from './components/TopNav';
import OverviewPage from './pages/OverviewPage';
import PredictPage from './pages/PredictPage';
import InsightsPage from './pages/InsightsPage';
import PerformancePage from './pages/PerformancePage';
import AboutPage from './pages/AboutPage';
import type { CustomerInput } from './types/customer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingInput, setPendingInput] = useState<CustomerInput | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLoadExample = (input: CustomerInput) => {
    setPendingInput(input);
  };

  const clearPending = () => {
    setPendingInput(null);
  };

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav currentPage={currentPage} onNavigate={handleNavigate} />

        <main className="flex-1 overflow-y-auto">
          {currentPage === 'overview' && (
            <OverviewPage onNavigate={handleNavigate} onLoadExample={handleLoadExample} />
          )}
          {currentPage === 'predict' && (
            <PredictPage
              initialInput={pendingInput}
              onClearInitial={clearPending}
            />
          )}
          {currentPage === 'insights' && <InsightsPage />}
          {currentPage === 'performance' && <PerformancePage />}
          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
