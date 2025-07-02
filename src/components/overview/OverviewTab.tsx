import React from 'react';
import { Tv, Eye, Share2, TrendingUp, Users, Globe } from 'lucide-react';

interface OverviewTabProps {
  counts: {
    formats: number;
    vision: number;
    social: number;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ counts }) => {
  const stats = [
    {
      title: 'TV Formats',
      value: counts.formats,
      icon: Tv,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Vision Buttons',
      value: counts.vision,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Social Links',
      value: counts.social,
      icon: Share2,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Views',
      value: '2.4K',
      icon: Users,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive' as const,
    },
  ];

  const recentActivity = [
    {
      type: 'format',
      action: 'Created new TV format',
      title: 'Reality Competition Show',
      time: '2 hours ago',
    },
    {
      type: 'vision',
      action: 'Updated vision button',
      title: 'About Us Page',
      time: '5 hours ago',
    },
    {
      type: 'social',
      action: 'Added social link',
      title: 'Instagram Profile',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Mariah Universe Admin
            </h2>
            <p className="text-gray-600">
              Manage your TV formats, vision buttons, and social media links from this central dashboard.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-purple rounded-xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'format' ? 'bg-blue-100' :
                activity.type === 'vision' ? 'bg-purple-100' : 'bg-green-100'
              }`}>
                {activity.type === 'format' && <Tv className="w-4 h-4 text-blue-600" />}
                {activity.type === 'vision' && <Eye className="w-4 h-4 text-purple-600" />}
                {activity.type === 'social' && <Share2 className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.title}</p>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center card-hover">
          <Tv className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Manage TV Formats</h4>
          <p className="text-sm text-gray-600">Create and edit your television show formats</p>
        </div>
        
        <div className="card p-6 text-center card-hover">
          <Eye className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Vision Buttons</h4>
          <p className="text-sm text-gray-600">Configure navigation buttons for your website</p>
        </div>
        
        <div className="card p-6 text-center card-hover">
          <Share2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
          <p className="text-sm text-gray-600">Update your social media links and presence</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;