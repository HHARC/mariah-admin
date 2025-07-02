import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import OverviewTab from './components/overview/OverviewTab';
import FormatsTab from './components/formats/FormatsTab';
import VisionTab from './components/vision/VisionTab';
import SocialTab from './components/social/SocialTab';
import Toast from './components/ui/Toast';
import { formatsAPI, visionAPI, socialAPI } from './services/api';

interface ToastState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning';
  message: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    formats: 0,
    vision: 0,
    social: 0,
  });
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchCounts = async () => {
    try {
      const [formatsResponse, visionResponse, socialResponse] = await Promise.all([
        formatsAPI.getAll(),
        visionAPI.getAll(),
        socialAPI.getAll(),
      ]);

      setCounts({
        formats: formatsResponse.data.length,
        vision: visionResponse.data.length,
        social: socialResponse.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchCounts();
      showToast('success', 'Data refreshed successfully');
    } catch (error) {
      showToast('error', 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab counts={counts} />;
      case 'formats':
        return <FormatsTab onUpdate={fetchCounts} showToast={showToast} />;
      case 'vision':
        return <VisionTab onUpdate={fetchCounts} showToast={showToast} />;
      case 'social':
        return <SocialTab onUpdate={fetchCounts} showToast={showToast} />;
      default:
        return <OverviewTab counts={counts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      
      <div className="flex h-screen">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        
        {/* Main Content Area - Now responsive to sidebar state */}
        <main className={`
          flex-1 overflow-hidden transition-all duration-300 ease-in-out
          ${isCollapsed ? 'ml-0' : 'ml-0'}
        `}>
          <div className="h-full overflow-y-auto p-6">
            <div className={`
              mx-auto transition-all duration-300 ease-in-out
              ${isCollapsed ? 'max-w-full' : 'max-w-7xl'}
            `}>
              {renderActiveTab()}
            </div>
          </div>
        </main>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

export default App;