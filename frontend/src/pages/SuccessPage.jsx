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
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#F43F5E', '#FFE4E6']
    });
  };
  
  const copyLink = () => {
    const link = `${window.location.origin}/v/${valentineId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }
  
  const valentineLink = `${window.location.origin}/v/${valentineId}`;
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 paper-texture"></div>
      
      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-10 shadow-floating">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Success! 🎉
            </h1>
            <p className="text-lg text-foreground/70 font-body">
              Your Valentine surprise is ready to share!
            </p>
          </div>
          
          {valentine && (
            <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-body text-foreground/70 mb-2">Your shareable link:</h3>
              <div className="bg-white rounded-xl p-4 mb-4 break-all">
                <code className="text-primary font-body text-sm">{valentineLink}</code>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-testid="copy-link-btn"
                  onClick={copyLink}
                  className="rounded-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  data-testid="share-btn"
                  onClick={shareLink}
                  variant="outline"
                  className="rounded-full"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <a href={`/v/${valentineId}`} target="_blank" rel="noopener noreferrer">
              <Button
                data-testid="preview-btn"
                variant="outline"
                className="w-full rounded-full"
              >
                <Heart className="mr-2 h-4 w-4" />
                Preview Your Valentine
              </Button>
            </a>
            
            <Link to="/dashboard">
              <Button
                data-testid="back-dashboard-btn"
                variant="ghost"
                className="w-full rounded-full"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
