import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import UploadArea from './components/Upload/UploadArea';
import PromptAPI from './components/Prompt/PromptAPI';
import EndpointsList from './components/Endpoints/EndpointsList';
import Documentation from './components/Documentation/Documentation';
import BillingPage from './components/Billing/BillingPage';
import SettingsPage from './components/Settings/SettingsPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('prompt');

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadArea onSpecUpload={() => setActiveTab('endpoints')} />;
      case 'prompt':
        return <PromptAPI onSpecGenerated={() => setActiveTab('endpoints')} />;
      case 'endpoints':
        return <EndpointsList />;
      case 'docs':
        return <Documentation />;
      case 'billing':
        return <BillingPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <UploadArea onSpecUpload={() => setActiveTab('endpoints')} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <Header />
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-8">
            {renderContent()}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;