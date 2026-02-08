import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [valentines, setValentines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser();
    fetchValentines();
  }, []);
  
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  
  const fetchValentines = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/valentines`, {
        withCredentials: true
      });
      setValentines(response.data);
    } catch (error) {
      console.error('Error fetching valentines:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const copyLink = (valentineId) => {
    const link = `${window.location.origin}/v/${valentineId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied! 📋✨');
  };
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden">
      <div className="relative z-10">
        <header className="container max-w-6xl mx-auto px-4 py-6 flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-cartoon animate-bounce">
              <Heart className="h-7 w-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-heading font-bold text-foreground">Cupid's Prank</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-cartoon">
                <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full border-3 border-primary" />
                <span className="text-foreground font-body font-semibold hidden sm:inline">{user.name}</span>
              </div>
            )}
            <Button data-testid="logout-btn" onClick={handleLogout} className="cartoon-border rounded-full px-6 font-heading font-bold bg-white hover:bg-gray-50">
              Logout
            </Button>
          </div>
        </header>
        
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-cartoon border-4 border-foreground/10 flex-1">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
                Your <span className="text-primary">Valentines</span> 💕
              </h1>
              <p className="text-foreground/70 font-body text-lg">Create and manage your love pranks!</p>
            </div>
            <Link to="/create">
              <Button data-testid="create-new-btn" size="lg" className="cartoon-border rounded-full px-8 py-6 text-xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating animate-pulse hover:scale-110 transition-all text-white">
                <Plus className="mr-2 h-6 w-6" />
                Create New ✨
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 animate-bounce">💖</div>
              <p className="text-2xl text-foreground/70 font-heading font-bold">Loading your valentines...</p>
            </div>
          ) : valentines.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-cartoon p-12 border-4 border-foreground/10">
              <div className="text-8xl mb-6 wiggle inline-block">💝</div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                No valentines yet!
              </h2>
              <p className="text-xl text-foreground/70 font-body mb-8">
                Create your first Valentine surprise and spread the love! 🎉
              </p>
              <Link to="/create">
                <Button data-testid="create-first-btn" size="lg" className="cartoon-border rounded-full px-10 py-6 text-xl font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                  Create Your First Valentine 💖
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {valentines.map((valentine) => (
                <div 
                  key={valentine.valentine_id}
                  data-testid={`valentine-card-${valentine.valentine_id}`}
                  className="bg-white rounded-3xl p-6 shadow-cartoon border-4 border-foreground/10 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        To: {valentine.to_name} 💕
                      </h3>
                      <p className="text-sm text-foreground/60 font-body">From: {valentine.from_name}</p>
                    </div>
                    {valentine.payment_status === 'completed' && (
                      <div className="bg-green-100 rounded-full p-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-secondary/50 rounded-2xl p-4 mb-4">
                    <p className="text-foreground/80 font-body text-sm line-clamp-2">
                      {valentine.message}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-body font-bold rounded-full border-2 border-primary/20">
                      {valentine.template_id.replace('_', ' ').toUpperCase()}
                    </span>
                    {valentine.response && (
                      <span className={`px-3 py-1 text-xs font-body font-bold rounded-full border-2 ${
                        valentine.response === 'yes' 
                          ? 'bg-green-100 text-green-700 border-green-300' 
                          : 'bg-amber-100 text-amber-700 border-amber-300'
                      }`}>
                        {valentine.response === 'yes' ? 'They said Yes! 🎉' : 'Waiting... 🤔'}
                      </span>
                    )}
                  </div>
                  
                  {valentine.payment_status === 'completed' ? (
                    <div className="flex gap-2">
                      <Button 
                        data-testid={`copy-link-${valentine.valentine_id}`}
                        onClick={() => copyLink(valentine.valentine_id)}
                        className="flex-1 rounded-full font-heading font-bold"
                        size="sm"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <a 
                        href={`/v/${valentine.valentine_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        <Button 
                          data-testid={`view-${valentine.valentine_id}`}
                          variant="outline" 
                          size="sm" 
                          className="rounded-full font-heading font-bold border-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <Button 
                      data-testid={`complete-payment-${valentine.valentine_id}`}
                      onClick={() => navigate(`/payment/${valentine.valentine_id}`)}
                      className="w-full rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      Complete Payment ₹15 💳
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
