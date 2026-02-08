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
    toast.success('Link copied to clipboard!');
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 paper-texture"></div>
      
      <div className="relative z-10">
        <header className="container max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">Cupid's Prank</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full border-2 border-primary" />
                <span className="text-foreground font-body hidden sm:inline">{user.name}</span>
              </div>
            )}
            <Button data-testid="logout-btn" onClick={handleLogout} variant="outline" className="rounded-full">
              Logout
            </Button>
          </div>
        </header>
        
        <main className="container max-w-6xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
                Your <span className="italic text-primary">Valentine</span> Surprises
              </h1>
              <p className="text-foreground/70 font-body">Create and manage your love pranks</p>
            </div>
            <Link to="/create">
              <Button data-testid="create-new-btn" size="lg" className="rounded-full px-8 shadow-soft hover:shadow-floating transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Create New
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/70 font-body">Loading your valentines...</p>
            </div>
          ) : valentines.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-20 w-20 text-primary/20 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                No valentines yet!
              </h2>
              <p className="text-foreground/70 font-body mb-8">
                Create your first Valentine surprise and spread the love
              </p>
              <Link to="/create">
                <Button data-testid="create-first-btn" size="lg" className="rounded-full px-8">
                  Create Your First Valentine
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {valentines.map((valentine) => (
                <div 
                  key={valentine.valentine_id}
                  data-testid={`valentine-card-${valentine.valentine_id}`}
                  className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-soft hover:shadow-floating transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                        To: {valentine.to_name}
                      </h3>
                      <p className="text-sm text-foreground/60 font-body">From: {valentine.from_name}</p>
                    </div>
                    {valentine.payment_status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-foreground/80 font-body text-sm mb-4 line-clamp-2">
                    {valentine.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-body rounded-full">
                      {valentine.template_id.replace('_', ' ')}
                    </span>
                    {valentine.response && (
                      <span className={`px-3 py-1 text-xs font-body rounded-full ${
                        valentine.response === 'yes' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {valentine.response === 'yes' ? 'They said Yes! 🎉' : 'Still thinking...'}
                      </span>
                    )}
                  </div>
                  
                  {valentine.payment_status === 'completed' ? (
                    <div className="flex gap-2">
                      <Button 
                        data-testid={`copy-link-${valentine.valentine_id}`}
                        onClick={() => copyLink(valentine.valentine_id)}
                        className="flex-1 rounded-full"
                        size="sm"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
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
                          className="rounded-full"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <Button 
                      data-testid={`complete-payment-${valentine.valentine_id}`}
                      onClick={() => navigate(`/payment/${valentine.valentine_id}`)}
                      className="w-full rounded-full"
                      size="sm"
                    >
                      Complete Payment
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
