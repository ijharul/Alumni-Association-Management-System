import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Check, Sparkles, Gem, Zap, ArrowRight } from 'lucide-react';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const plans = [
  {
    id: 'Free',
    name: 'Starter',
    price: '₹0',
    period: '/ lifetime',
    tokens: 50,
    color: 'indigo',
    icon: Zap,
    features: [
      '50 AI Tokens',
      'Basic Mentorship Access',
      'Public Profile',
      'Network Directory',
    ],
    cta: 'Current Plan',
    disabled: true,
    popular: false,
  },
  {
    id: 'Monthly',
    name: 'Monthly Elite',
    price: '₹199',
    period: '/ month',
    tokens: 300,
    color: 'purple',
    icon: Sparkles,
    features: [
      '300 AI Tokens / month',
      'Resume Analysis (−10t)',
      'Career Roadmap (−5t)',
      'Unlimited Mentorship',
      'Priority Referral Visibility',
    ],
    cta: 'Upgrade to Monthly',
    disabled: false,
    popular: true,
  },
  {
    id: 'Yearly',
    name: 'Yearly Genesis',
    price: '₹1499',
    period: '/ year',
    tokens: 1000,
    color: 'blue',
    icon: Gem,
    features: [
      '1000 AI Tokens / year',
      'All Monthly features',
      'Multi-Job Referral Blasts',
      'Analytics Dashboard',
      'Priority Support',
    ],
    cta: 'Get Best Value',
    disabled: false,
    popular: false,
  },
];

const colorMap = {
  indigo: {
    ring: 'ring-indigo-500/40',
    badge: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    check: 'text-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20',
    selectedBorder: 'border-indigo-500',
  },
  purple: {
    ring: 'ring-purple-500/60',
    badge: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    check: 'text-purple-500',
    btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30',
    selectedBorder: 'border-purple-500',
  },
  blue: {
    ring: 'ring-blue-500/40',
    badge: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    check: 'text-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20',
    selectedBorder: 'border-blue-500',
  },
};

const Pricing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  // FIX: track selected plan — default to Monthly (most popular)
  const [selectedPlan, setSelectedPlan] = useState('Monthly');

  const handleUpgrade = async (planId) => {
    if (planId === 'Free') return;
    setLoading(planId);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Check your network.');
        setLoading(null);
        return;
      }

      const orderRes = await api.post('/payment/create-order', { planId });
      const orderToken = orderRes.data;
      if (!orderToken) throw new Error('Order creation failed.');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: orderToken.amount,
        currency: orderToken.currency,
        name: 'Alumni Connect',
        description: `Upgrade to ${planId} Plan`,
        order_id: orderToken.id,
        handler: async (response) => {
          toast.success('Payment received! Verifying...');
          try {
            await api.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            });
            toast.success(`${planId} Plan activated! 🎉`);
            window.location.href = '/';
          } catch {
            toast.error('Payment verification failed.');
          }
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => toast.error(r.error.description || 'Payment failed.'));
      rzp.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to start payment.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 w-full">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Pricing Plans
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
          Supercharge your career
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Unlock AI-powered tools, priority referrals, and unlimited mentorship.
          Start free — upgrade anytime.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const c = colorMap[plan.color];
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
              className={`
                relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200
                bg-white dark:bg-slate-800
                ${isSelected
                  ? `${c.selectedBorder} shadow-xl ring-4 ${c.ring} -translate-y-1`
                  : 'border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }
                ${!plan.disabled ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && !plan.disabled && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-indigo-600 dark:bg-purple-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon + Name */}
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${c.iconBg} mb-4 ${plan.popular ? 'mt-4' : ''}`}>
                <Icon className={`w-5 h-5 ${c.iconColor}`} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>

              {/* Price */}
              <div className="mt-2 mb-5">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
              </div>

              {/* Token highlight */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${c.badge} mb-5`}>
                <Zap className="w-3.5 h-3.5" /> {plan.tokens} AI Tokens
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${c.check}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleUpgrade(plan.id); }}
                disabled={plan.disabled || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.disabled
                    ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                    : `${c.btn} transform hover:scale-[1.02] active:scale-[0.98]`
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    {plan.cta}
                    {!plan.disabled && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-10">
        All plans include access to the Alumni Connect network. Payments secured via Razorpay.
      </p>
    </div>
  );
};

export default Pricing;
