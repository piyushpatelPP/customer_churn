import React from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, UserSearch, BarChart2, Activity, Info, Beaker } from 'lucide-react';

type Page = 'overview' | 'predict' | 'insights' | 'performance' | 'about';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'overview' as Page, label: 'Overview', icon: LayoutDashboard },
  { id: 'predict' as Page, label: 'Predict Customer', icon: UserSearch },
  { id: 'insights' as Page, label: 'Dataset Insights', icon: BarChart2 },
  { id: 'performance' as Page, label: 'Model Performance', icon: Activity },
  { id: 'about' as Page, label: 'About Project', icon: Info },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed, onToggle }) => {
  return (
    <aside
      className={`sidebar-transition flex flex-col h-full bg-navy border-r border-white/10 ${
        collapsed ? 'w-16' : 'w-60'
      } relative z-20 flex-shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg gradient-electric flex items-center justify-center flex-shrink-0 shadow-lg">
          <Beaker size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-base leading-tight tracking-tight">ChurnIQ</div>
            <div className="text-blue-300 text-xs font-medium">Customer Intelligence Studio</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-electric text-white shadow-md'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-xs text-blue-300 font-medium">Predicting Customer Churn</div>
          <div className="text-xs text-blue-400 mt-0.5">with TabPFN</div>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-emerald-300 font-medium">Prototype</span>
          </div>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-electric border-2 border-white flex items-center justify-center shadow-md hover:scale-110 transition-transform z-30"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} className="text-white" /> : <ChevronLeft size={12} className="text-white" />}
      </button>
    </aside>
  );
};

export default Sidebar;
export type { Page };
