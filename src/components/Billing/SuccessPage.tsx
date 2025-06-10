import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

const SuccessPage: React.FC = () => {
  const { refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
          
          <p className="text-gray-300 mb-8">
            Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
          </p>

          <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-violet-400" />
              <span className="text-violet-400 font-medium">Premium Access Activated</span>
            </div>
            <p className="text-gray-300 text-sm">
              You can now create unlimited API projects and access advanced AI features.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/billing"
              className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>View Billing Details</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            
            <a
              href="/"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;