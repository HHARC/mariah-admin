import React from 'react';
import { Tv, Eye, Share2, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    formats: number;
    vision: number;
    social: number;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  counts, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      count: null,
    },
    {
      id: 'formats',
      label: 'TV Formats',
      icon: Tv,
      count: counts.formats,
    },
    {
      id: 'vision',
      label: 'Vision Buttons',
      icon: Eye,
      count: counts.vision,
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Share2,
      count: counts.social,
    },
  ];

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      bg-white border-r border-gray-200 shadow-soft transition-all duration-300 ease-in-out
      relative
    `}>
      {/* Collapse/Expand Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 z-10"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-soft' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? tab.label : ''}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{tab.label}</span>
                )}
              </div>
              {!isCollapsed && tab.count !== null && (
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {tab.count}
                </span>
              )}
              {isCollapsed && tab.count !== null && (
                <span className={`
                  absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center
                  ${isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;