import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, CreditCard } from 'lucide-react';
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
  
  useEffect(() => {
    fetchValentine();
    loadRazorpayScript();
  }, [valentineId]);
  
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
      toast.error('Valentine not found');
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
          amount: 15,
          currency: 'INR'
        },
        { withCredentials: true }
      );
      
      const options = {
        key: RAZORPAY_KEY,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.order_id,
        name: "Cupid's Prank",
        description: 'Valentine Surprise Link',
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
            
            toast.success('Payment successful!');
            navigate(`/success/${valentineId}`);
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#E11D48'
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 paper-texture"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-10 shadow-floating">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 rounded-2xl mb-4">
              <Heart className="h-8 w-8 text-primary fill-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Almost There!
            </h1>
            <p className="text-foreground/70 font-body">
              Complete payment to get your shareable link
            </p>
          </div>
          
          {valentine && (
            <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70 font-body">To:</span>
                  <span className="text-foreground font-body font-semibold">{valentine.to_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70 font-body">From:</span>
                  <span className="text-foreground font-body font-semibold">{valentine.from_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70 font-body">Template:</span>
                  <span className="text-foreground font-body font-semibold capitalize">
                    {valentine.template_id.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-heading font-semibold text-foreground">Total</span>
                  <span className="text-3xl font-heading font-bold text-primary">₹15</span>
                </div>
              </div>
            </div>
          )}
          
          <Button
            data-testid="pay-now-btn"
            onClick={handlePayment}
            disabled={processing}
            className="w-full rounded-full py-6 text-lg shadow-soft hover:shadow-floating transition-all"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {processing ? 'Processing...' : 'Pay ₹15 Now'}
          </Button>
          
          <p className="text-center text-xs text-foreground/60 font-body mt-6">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
