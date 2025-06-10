import React from 'react';
import { 
  Upload, 
  Database, 
  Settings, 
  FileText,
  Sparkles,
  Wand2,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'prompt', label: 'Prompt API', icon: Wand2 },
    { id: 'upload', label: 'Upload API', icon: Upload },
    { id: 'endpoints', label: 'Endpoints', icon: Database },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 h-screen sticky top-16">
      <div className="p-6">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">AI-Powered</span>
            </div>
            <p className="text-xs text-gray-400">
              Intelligent mock responses generated using advanced AI algorithms
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-white border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-violet-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;