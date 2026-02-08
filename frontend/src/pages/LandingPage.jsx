import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gift, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LandingPage = () => {
  const [pricing, setPricing] = useState({
    symbol: '₹',
    prices: {
      single: 9.99,
      bundle_3: 24.99,
      bundle_5: 34.99
    },
    currency: 'INR'
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPricing();
  }, []);
  
  const fetchPricing = async () => {
    try {
      // Get user's timezone from browser
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const response = await axios.post(`${BACKEND_URL}/api/payment/pricing`, {
        timezone: userTimezone
      });
      
      setPricing({
        symbol: response.data.symbol,
        prices: response.data.prices,
        currency: response.data.currency,
        region: response.data.region,
        timezone: response.data.timezone
      });
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden">
      <div className="floating-hearts">
        <div className="heart" style={{animationDelay: '0s'}}>💕</div>
        <div className="heart" style={{animationDelay: '2s'}}>💖</div>
        <div className="heart" style={{animationDelay: '4s'}}>💗</div>
        <div className="heart" style={{animationDelay: '1s'}}>💓</div>
        <div className="heart" style={{animationDelay: '3s'}}>💝</div>
      </div>
      
      <div className="relative z-10">
        <header className="container max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-cartoon animate-bounce">
              <Heart className="h-7 w-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-heading font-bold text-foreground">Cupid's Prank</span>
          </div>
          <Link to="/login">
            <Button data-testid="header-login-btn" className="cartoon-border rounded-full px-6 py-3 bg-primary hover:bg-primary/90 font-heading font-bold text-lg text-white">
              Sign In
            </Button>
          </Link>
        </header>
        
        <main className="container max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="font-accent text-2xl text-primary rotate-[-3deg] inline-block bg-white px-4 py-2 rounded-2xl shadow-cartoon">
                  Valentine's Special 💘
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                Make Them Say <span className="text-primary wiggle inline-block">YES!</span> to Love
              </h1>
              <p className="text-xl text-foreground/80 font-body leading-relaxed">
                Create the CUTEST Valentine's surprise ever! Pick a fun prank template that makes saying "No" super hard 😊
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/login">
                  <Button 
                    data-testid="get-started-btn" 
                    size="lg" 
                    className="cartoon-border rounded-full px-10 py-6 text-xl font-heading font-bold bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-floating text-white"
                  >
                    Get Started
                    <Sparkles className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <a href="/v/demo" target="_blank" rel="noopener noreferrer">
                  <Button 
                    data-testid="try-demo-btn" 
                    size="lg" 
                    className="cartoon-border rounded-full px-10 py-6 text-xl font-heading font-bold bg-white hover:bg-gray-50 text-foreground border-4"
                  >
                    Try Demo 👀
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <img src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/hkh1cha6_face1.svg" alt="Character" className="h-12 w-12 rounded-full border-4 border-white shadow-md" />
                  <img src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/v6n5belr_face2.svg" alt="Character" className="h-12 w-12 rounded-full border-4 border-white shadow-md" />
                  <img src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/xf1uempv_face3.svg" alt="Character" className="h-12 w-12 rounded-full border-4 border-white shadow-md" />
                  <img src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/9fqt9wyl_face4.svg" alt="Character" className="h-12 w-12 rounded-full border-4 border-white shadow-md" />
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 border-4 border-white shadow-md flex items-center justify-center text-white font-bold">+</div>
                </div>
                <p className="text-sm text-foreground/70 font-body">
                  <span className="font-bold text-primary text-lg">2,847+</span> couples made magic 💖
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[3rem] blur-2xl animate-pulse"></div>
              <div className="relative bg-white rounded-[3rem] p-8 shadow-cartoon">
                <img 
                  src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/04tdjn8i_adventure.png" 
                  alt="Happy cartoon couple"
                  className="w-full h-auto mx-auto"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-3xl p-4 shadow-cartoon animate-bounce">
                  <p className="text-4xl">💕</p>
                </div>
                <div className="absolute -top-4 -left-4 bg-white rounded-3xl p-4 shadow-cartoon wiggle">
                  <p className="text-4xl">✨</p>
                </div>
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/e5xd1fq7_fly.png"
                    alt="Flying character"
                    className="h-20 w-20 animate-bounce"
                  />
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4">
                How It <span className="text-primary">Works!</span>
              </h2>
              <p className="text-xl text-foreground/70 font-body">Super simple, super fun! 🎉</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-cartoon hover:scale-105 transition-all duration-300 border-4 border-foreground/10">
                <div className="h-20 w-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl flex items-center justify-center mb-6 shadow-md mx-auto">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3 text-center">Pick Template</h3>
                <p className="text-foreground/70 font-body leading-relaxed text-center">
                  Choose from 5 HILARIOUS templates - runaway buttons, guilt trips & more! 😂
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-cartoon hover:scale-105 transition-all duration-300 border-4 border-foreground/10">
                <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-md mx-auto">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3 text-center">Customize</h3>
                <p className="text-foreground/70 font-body leading-relaxed text-center">
                  Add your names, write a sweet message, make it PERFECT! 💌
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-cartoon hover:scale-105 transition-all duration-300 border-4 border-foreground/10">
                <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-teal-400 rounded-3xl flex items-center justify-center mb-6 shadow-md mx-auto">
                  <Gift className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3 text-center">Share Link</h3>
                <p className="text-foreground/70 font-body leading-relaxed text-center">
                  Get your unique link instantly & watch the magic unfold! 🎊
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4">
                Why Choose <span className="text-primary">Cupid's Prank?</span>
              </h2>
              <p className="text-xl text-foreground/70 font-body">The ONLY Valentine surprise they'll remember forever!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-cartoon border-4 border-foreground/10">
                <div className="text-5xl mb-4">😂</div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">5 Hilarious Templates</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  From runaway buttons to guilt trips - each template is designed to make saying "No" IMPOSSIBLE!
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-cartoon border-4 border-foreground/10">
                <div className="text-5xl mb-4">💕</div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Fully Customizable</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Add your names, write a personal message, and make it uniquely YOURS!
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-cartoon border-4 border-foreground/10">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Works Everywhere</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Mobile, tablet, desktop - your Valentine surprise looks AMAZING on any device!
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-cartoon border-4 border-foreground/10">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Instant Delivery</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Create, pay, and get your shareable link in under 2 minutes! No waiting!
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-gradient-to-br from-primary to-accent rounded-3xl p-12 text-center shadow-floating">
            <Zap className="h-20 w-20 text-white mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
              Valentine's Special! 💝
            </h2>
            
            {loading ? (
              <div className="text-white text-xl mb-8">Loading pricing...</div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/30 hover:scale-105 transition-all">
                    <div className="text-white/80 text-sm font-body mb-2">SINGLE</div>
                    <div className="flex items-baseline justify-center gap-2 mb-3">
                      <span className="text-5xl font-heading font-bold text-white drop-shadow-lg">
                        {pricing.symbol}{pricing.prices.single}
                      </span>
                      <span className="text-lg text-white/80 font-body">/ link</span>
                    </div>
                    <p className="text-white/90 text-sm font-body">Perfect for that special someone</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 hover:scale-105 transition-all relative">
                    <div className="absolute -top-3 right-4 bg-yellow-400 text-foreground px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR ⭐
                    </div>
                    <div className="text-white/80 text-sm font-body mb-2">3 LINKS BUNDLE</div>
                    <div className="flex items-baseline justify-center gap-2 mb-3">
                      <span className="text-6xl font-heading font-bold text-white drop-shadow-lg">
                        {pricing.symbol}{pricing.prices.bundle_3}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm font-body mb-2">
                      {pricing.symbol}{(pricing.prices.bundle_3 / 3).toFixed(2)}/link - Save 16%!
                    </p>
                    <p className="text-white/80 text-xs font-body">Best for testing different pranks</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/30 hover:scale-105 transition-all">
                    <div className="text-white/80 text-sm font-body mb-2">5 LINKS BUNDLE</div>
                    <div className="flex items-baseline justify-center gap-2 mb-3">
                      <span className="text-5xl font-heading font-bold text-white drop-shadow-lg">
                        {pricing.symbol}{pricing.prices.bundle_5}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm font-body mb-2">
                      {pricing.symbol}{(pricing.prices.bundle_5 / 5).toFixed(2)}/link - Save 30%!
                    </p>
                    <p className="text-white/80 text-xs font-body">Ultimate value pack</p>
                  </div>
                </div>
              </>
            )}
            
            <p className="text-white text-xl font-body mb-8 max-w-2xl mx-auto drop-shadow">
              Less than a coffee price = FOREVER memory for both of you! 💖✨
            </p>
            <Link to="/login">
              <Button 
                data-testid="cta-create-btn"
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 rounded-full px-12 py-7 text-2xl font-heading font-bold shadow-cartoon hover:scale-110 transition-all text-primary"
              >
                Create Your Valentine Surprise! 🎁
              </Button>
            </Link>
          </section>
        </main>
        
        <footer className="container max-w-6xl mx-auto px-4 py-8 mt-12">
          <div className="text-center text-foreground/60 font-body text-sm bg-white rounded-3xl p-6 shadow-cartoon">
            <p className="text-lg mb-2">Made with 💖 by Cupid's Prank</p>
            <p>© 2026 All rights reserved • Spread Love, Not Boring! 😊</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
