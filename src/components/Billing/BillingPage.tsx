import React, { useState } from 'react';
import { 
  CreditCard, 
  Crown, 
  Check, 
  Loader, 
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { stripeProducts } from '../../stripe-config';
import { createCheckoutSession } from '../../utils/stripe';
import toast from 'react-hot-toast';

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading, isActive } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planName: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      return;
    }

    setLoadingPlan(priceId);

    try {
      const successUrl = `${window.location.origin}/billing/success`;
      const cancelUrl = `${window.location.origin}/billing`;

      const { url } = await createCheckoutSession({
        priceId,
        successUrl,
        cancelUrl,
        mode: 'subscription'
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
    return stripeProducts.find(product => product.priceId === subscription.price_id);
  };

  const currentPlan = getCurrentPlan();

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Billing & Plans</h2>
          <p className="text-gray-400">Sign in to manage your subscription</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <CreditCard className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400">
            Please sign in to view and manage your billing information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Billing & Plans</h2>
        <p className="text-gray-400">Manage your subscription and billing information</p>
      </div>

      {/* Current Subscription Status */}
      {subscriptionLoading ? (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <Loader className="h-6 w-6 text-violet-400 animate-spin mr-3" />
            <span className="text-gray-300">Loading subscription information...</span>
          </div>
        </div>
      ) : subscription ? (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Current Subscription</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-medium text-white">
                    {subscription.product_name || 'Unknown Plan'}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {subscription.subscription_status}
                </span>
              </div>
            </div>
            {currentPlan && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{currentPlan.price}</div>
                <div className="text-sm text-gray-400">per month</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Current Period</span>
              </div>
              <div className="text-white">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </div>
            </div>

            {subscription.payment_method_brand && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Payment Method</span>
                </div>
                <div className="text-white">
                  {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                </div>
              </div>
            )}

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Auto Renewal</span>
              </div>
              <div className="text-white">
                {subscription.cancel_at_period_end ? 'Canceled' : 'Active'}
              </div>
            </div>
          </div>

          {subscription.cancel_at_period_end && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium mb-1">Subscription Ending</h4>
                  <p className="text-yellow-300 text-sm">
                    Your subscription will end on {formatDate(subscription.current_period_end)}. 
                    You can reactivate it anytime before then.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Subscription</h3>
          <p className="text-gray-400">Choose a plan below to get started with MockServer.ai</p>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stripeProducts.map((product) => {
            const isCurrentPlan = currentPlan?.priceId === product.priceId;
            const isLoading = loadingPlan === product.priceId;
            
            return (
              <div
                key={product.id}
                className={`relative bg-gray-800/50 border rounded-xl p-6 ${
                  isCurrentPlan 
                    ? 'border-violet-500 ring-2 ring-violet-500/20' 
                    : 'border-gray-700 hover:border-gray-600'
                } transition-all duration-200`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-violet-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
                  <div className="text-3xl font-bold text-white mb-1">{product.price}</div>
                  <div className="text-sm text-gray-400">per month</div>
                  <p className="text-gray-400 text-sm mt-3">{product.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {product.name === 'Free' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">5 API projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Basic mock responses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Community support</span>
                      </div>
                    </>
                  )}
                  
                  {product.name === 'Hobby' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">25 API projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">AI-powered responses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Email support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Custom response times</span>
                      </div>
                    </>
                  )}
                  
                  {product.name === 'Pro' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Unlimited API projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Advanced AI features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Priority support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Team collaboration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">API analytics</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleUpgrade(product.priceId, product.name)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isCurrentPlan
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : isLoading
                      ? 'bg-violet-500/50 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : isCurrentPlan ? (
                    <span>Current Plan</span>
                  ) : (
                    <span>Choose Plan</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;