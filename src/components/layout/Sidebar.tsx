import React from 'react';
import { Tv, Eye, Share2, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    formats: number;
    vision: number;
    social: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, counts }) => {
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
    <aside className="w-64 bg-white border-r border-gray-200 shadow-soft">
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
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="font-medium">{tab.label}</span>
              </div>
              {tab.count !== null && (
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
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;