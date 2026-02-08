import { Heart } from 'lucide-react';
import { Button } from '../components/ui/button';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden flex items-center justify-center">
      <div className="floating-hearts">
        <div className="heart" style={{animationDelay: '0s'}}>💕</div>
        <div className="heart" style={{animationDelay: '2s'}}>💖</div>
        <div className="heart" style={{animationDelay: '4s'}}>💗</div>
        <div className="heart" style={{animationDelay: '1s'}}>💓</div>
        <div className="heart" style={{animationDelay: '3s'}}>💝</div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-[3rem] p-10 shadow-cartoon border-4 border-foreground/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/3lq311c1_spacemanreadingmap-in-space-space.png"
                alt="Spaceman"
                className="h-40 w-40 animate-bounce"
              />
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
              Welcome! 💖
            </h1>
            <p className="text-xl text-foreground/70 font-body">
              Sign in to create your <span className="text-primary font-bold">Valentine surprise!</span>
            </p>
          </div>
          
          <Button
            data-testid="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full cartoon-border rounded-full py-7 text-xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-105 transition-all"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <p className="text-center text-sm text-foreground/60 font-body mt-6">
            By continuing, you agree to spread LOVE everywhere! 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
