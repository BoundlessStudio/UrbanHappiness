import React from 'react';
import { Settings, User, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ApiKeySection from './ApiKeySection';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Sign in to access your settings</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Settings className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400">
            Please sign in to access your account settings and preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Profile Information</h3>
              <p className="text-gray-400 text-sm mb-6">
                Your basic account information and preferences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.user_metadata?.full_name || ''}
                    readOnly
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                    tabIndex={-1}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                To update your profile information, please contact support.
              </div>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <ApiKeySection />
        </div>

        {/* Security Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Security</h3>
              <p className="text-gray-400 text-sm mb-6">
                Manage your account security settings.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium text-sm">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-xs mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                    Coming Soon
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium text-sm">Login Sessions</h4>
                    <p className="text-gray-400 text-xs mt-1">Manage your active login sessions</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
              <p className="text-gray-400 text-sm mb-6">
                Configure how you receive notifications about your API usage.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium text-sm">Email Notifications</h4>
                    <p className="text-gray-400 text-xs mt-1">Receive updates about your API usage and billing</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                    Coming Soon
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium text-sm">Usage Alerts</h4>
                    <p className="text-gray-400 text-xs mt-1">Get notified when you approach your plan limits</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;