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
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
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