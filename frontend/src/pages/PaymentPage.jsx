import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, CreditCard, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

const PaymentPage = () => {
  const { valentineId } = useParams();
  const navigate = useNavigate();
  const [valentine, setValentine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState('single');
  const [pricing, setPricing] = useState({
    symbol: '₹',
    currency: 'INR',
    bundles: {
      single: { price: 9.99, name: 'Single Link', links: 1, savings: 0 },
      bundle_3: { price: 24.99, name: '3 Links Bundle', links: 3, savings: 16, popular: true },
      bundle_5: { price: 34.99, name: '5 Links Bundle', links: 5, savings: 30 }
    }
  });
  
  useEffect(() => {
    fetchPricing();
    fetchValentine();
    loadRazorpayScript();
  }, [valentineId]);
  
  const fetchPricing = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/payment/pricing`);
      setPricing({
        symbol: response.data.symbol,
        currency: response.data.currency,
        bundles: {
          single: { price: response.data.prices.single, name: 'Single Link', links: 1, savings: 0 },
          bundle_3: { price: response.data.prices.bundle_3, name: '3 Links Bundle', links: 3, savings: 16, popular: true },
          bundle_5: { price: response.data.prices.bundle_5, name: '5 Links Bundle', links: 5, savings: 30 }
        }
      });
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  };
  
  const fetchValentine = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/valentines/${valentineId}`, {
        withCredentials: true
      });
      setValentine(response.data);
      
      if (response.data.payment_status === 'completed') {
        navigate(`/success/${valentineId}`);
      }
    } catch (error) {
      console.error('Error fetching valentine:', error);
      toast.error('Valentine not found!');
    } finally {
      setLoading(false);
    }
  };
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/payment/create-order`,
        {
          valentine_id: valentineId,
          amount: pricing.bundles[selectedBundle].price,
          currency: pricing.currency,
          bundle_type: selectedBundle
        },
        { withCredentials: true }
      );
      
      const options = {
        key: RAZORPAY_KEY,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.order_id,
        name: "Cupid's Prank",
        description: pricing.bundles[selectedBundle].name,
        handler: async function (response) {
          try {
            await axios.post(
              `${BACKEND_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                valentine_id: valentineId
              },
              { withCredentials: true }
            );
            
            toast.success('Payment successful! 🎉');
            navigate(`/success/${valentineId}`);
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#FF6B9D'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cartoon-bg">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">💖</div>
          <p className="text-2xl text-foreground font-heading font-bold">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden flex items-center justify-center py-8">
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="bg-white rounded-[3rem] p-10 shadow-cartoon border-4 border-foreground/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/eye8k9ce_lincoln.png"
                alt="Cupid"
                className="h-24 w-24 animate-bounce"
              />
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
              Choose Your Package! 🎁
            </h1>
            <p className="text-lg text-foreground/70 font-body">
              Select the best value for your Valentine surprises!
            </p>
          </div>
          
          {/* Bundle Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {Object.entries(pricing.bundles).map(([key, bundle]) => (
              <button
                key={key}
                onClick={() => setSelectedBundle(key)}
                className={`relative rounded-3xl p-6 transition-all duration-300 border-4 ${
                  selectedBundle === key
                    ? 'bg-gradient-to-br from-primary to-pink-400 text-white border-foreground shadow-floating scale-105'
                    : 'bg-white text-foreground border-foreground/10 hover:scale-105 shadow-cartoon'
                }`}
              >
                {bundle.popular && (
                  <div className="absolute -top-3 right-4 bg-yellow-400 text-foreground px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR ⭐
                  </div>
                )}
                <div className={`text-sm font-body mb-2 ${selectedBundle === key ? 'text-white/80' : 'text-foreground/60'}`}>
                  {bundle.name.toUpperCase()}
                </div>
                <div className="text-4xl font-heading font-bold mb-2">
                  {pricing.symbol}{bundle.price}
                </div>
                <div className={`text-sm font-body mb-3 ${selectedBundle === key ? 'text-white/90' : 'text-foreground/70'}`}>
                  {bundle.links} {bundle.links === 1 ? 'Link' : 'Links'}
                </div>
                {bundle.savings > 0 && (
                  <div className={`text-xs font-bold ${selectedBundle === key ? 'text-white' : 'text-green-600'}`}>
                    SAVE {bundle.savings}%! 🎉
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {valentine && (
            <div className="bg-gradient-to-br from-secondary/50 to-accent/30 rounded-3xl p-6 mb-8 border-4 border-foreground/10">
              <h3 className="text-lg font-heading font-bold text-foreground mb-4 text-center">Your Valentine Details</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-body">To:</span>
                  <span className="text-foreground font-heading font-bold text-lg">{valentine.to_name} 💕</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-body">From:</span>
                  <span className="text-foreground font-heading font-bold text-lg">{valentine.from_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-body">Template:</span>
                  <span className="text-foreground font-body font-semibold capitalize">
                    {valentine.template_id.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="border-t-4 border-foreground/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-heading font-bold text-foreground">Total</span>
                  <span className="text-5xl font-heading font-bold text-primary">{pricing.symbol}{pricing.bundles[selectedBundle].price}</span>
                </div>
                {pricing.bundles[selectedBundle].links > 1 && (
                  <p className="text-sm text-foreground/60 font-body text-right mt-2">
                    You'll get {pricing.bundles[selectedBundle].links} links total!
                  </p>
                )}
              </div>
            </div>
          )}
          
          <Button
            data-testid="pay-now-btn"
            onClick={handlePayment}
            disabled={processing}
            className="w-full cartoon-border rounded-full py-7 text-xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-105 transition-all text-white"
          >
            <CreditCard className="mr-2 h-6 w-6" />
            {processing ? 'Processing... ⏳' : `Pay ₹${bundles[selectedBundle].price} Now 💳`}
          </Button>
          
          <p className="text-center text-xs text-foreground/60 font-body mt-6">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
