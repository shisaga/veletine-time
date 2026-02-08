import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Copy, Share2, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SuccessPage = () => {
  const { valentineId } = useParams();
  const navigate = useNavigate();
  const [valentine, setValentine] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchValentine();
    triggerConfetti();
  }, [valentineId]);
  
  const fetchValentine = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/valentines/${valentineId}`, {
        withCredentials: true
      });
      setValentine(response.data);
    } catch (error) {
      console.error('Error fetching valentine:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
        colors: ['#FF6B9D', '#FFC2D1', '#FFE5EC', '#FFFFFF', '#2D1B4E']
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };
  
  const copyLink = () => {
    const link = `${window.location.origin}/v/${valentineId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied! 📋✨');
  };
  
  const shareLink = async () => {
    const link = `${window.location.origin}/v/${valentineId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Will you be my Valentine?",
          text: "I have a special question for you...",
          url: link
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyLink();
        }
      }
    } else {
      copyLink();
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
  
  const valentineLink = `${window.location.origin}/v/${valentineId}`;
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden flex items-center justify-center">
      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="bg-white rounded-[3rem] p-10 shadow-cartoon border-4 border-foreground/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-24 w-24 bg-green-100 rounded-full mb-6 border-4 border-green-300">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>
            <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
              Yay! Success! 🎉
            </h1>
            <p className="text-xl text-foreground/70 font-body">
              Your Valentine surprise is ready to share!
            </p>
          </div>
          
          {valentine && (
            <div className="bg-gradient-to-br from-secondary/50 to-accent/30 rounded-3xl p-6 mb-8 border-4 border-foreground/10">
              <h3 className="text-sm font-heading font-bold text-foreground/70 mb-3 text-center">🔗 Your Shareable Link:</h3>
              <div className="bg-white rounded-2xl p-4 mb-4 break-all border-4 border-foreground/10">
                <code className="text-primary font-body text-sm font-semibold">{valentineLink}</code>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-testid="copy-link-btn"
                  onClick={copyLink}
                  className="cartoon-border rounded-full font-heading font-bold"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy 📋
                </Button>
                <Button
                  data-testid="share-btn"
                  onClick={shareLink}
                  className="cartoon-border rounded-full font-heading font-bold bg-white hover:bg-gray-50 border-4"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share 📤
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <a href={`/v/${valentineId}`} target="_blank" rel="noopener noreferrer">
              <Button
                data-testid="preview-btn"
                className="w-full cartoon-border rounded-full font-heading font-bold bg-white hover:bg-gray-50 border-4"
              >
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Preview Your Valentine 👀
              </Button>
            </a>
            
            <Link to="/dashboard">
              <Button
                data-testid="back-dashboard-btn"
                className="w-full rounded-full font-heading font-bold bg-primary hover:bg-primary/90"
              >
                Back to Dashboard 🏠
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
