import React, { useState } from 'react';
import { Server, Zap, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription, isActive } = useSubscription();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Server className="h-8 w-8 text-violet-400" />
                  <Zap className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                    MockServer.ai
                  </h1>
                  <p className="text-xs text-gray-400">AI-Powered Mock APIs</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full flex items-center justify-center hover:from-violet-500 hover:to-blue-500 transition-all"
                  >
                    <User className="h-4 w-4 text-white" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm text-white font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        
                        {/* Subscription Status */}
                        {subscription && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Crown className="h-3 w-3 text-yellow-400" />
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isActive 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {subscription.product_name || 'Unknown Plan'}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;