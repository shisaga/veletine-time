import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gift, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 paper-texture"></div>
      
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
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">Cupid's Prank</span>
          </div>
          <Link to="/login">
            <Button data-testid="header-login-btn" className="rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </header>
        
        <main className="container max-w-6xl mx-auto px-4 py-12 lg:py-20">
          <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="font-accent text-xl text-primary rotate-[-2deg] inline-block">Valentine's Special 💘</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                Make Them Say <span className="italic text-primary">Yes</span> to Love
              </h1>
              <p className="text-lg text-foreground/80 font-body leading-relaxed">
                Create the most adorable and playful Valentine's surprise! Choose from fun interactive templates that make saying "No" nearly impossible.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/login">
                  <Button 
                    data-testid="get-started-btn" 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-lg shadow-floating hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full bg-rose-300 border-2 border-white"></div>
                  <div className="h-10 w-10 rounded-full bg-rose-400 border-2 border-white"></div>
                  <div className="h-10 w-10 rounded-full bg-rose-500 border-2 border-white"></div>
                </div>
                <p className="text-sm text-foreground/70 font-body">
                  <span className="font-semibold text-primary">2,847+</span> couples made magic
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1769674843865-c0cdaa8c5bab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxhdWdoaW5nJTIwc3Vuc2V0fGVufDB8fHx8MTc3MDU3MzAyN3ww&ixlib=rb-4.1.0&q=85" 
                alt="Happy couple"
                className="relative rounded-3xl shadow-floating w-full h-auto"
              />
            </div>
          </section>
          
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                How It <span className="italic text-primary">Works</span>
              </h2>
              <p className="text-lg text-foreground/70 font-body">Simple, playful, and totally irresistible</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-soft hover:shadow-floating transition-all duration-300">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Choose Template</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Pick from 5 playful templates - from runaway buttons to emotional guilt trips!
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-soft hover:shadow-floating transition-all duration-300">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Customize</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Add your names, write a sweet message, and personalize the magic.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-soft hover:shadow-floating transition-all duration-300">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Gift className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Share Link</h3>
                <p className="text-foreground/70 font-body leading-relaxed">
                  Pay just ₹15, get your unique link, and watch the magic unfold!
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-gradient-to-br from-primary to-accent rounded-3xl p-12 text-center shadow-floating">
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Valentine's Special Pricing
            </h2>
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-6xl font-heading font-bold text-white">₹15</span>
              <span className="text-xl text-white/80 font-body">/ link</span>
            </div>
            <p className="text-white/90 font-body text-lg mb-8 max-w-2xl mx-auto">
              One coffee for you = a memory for both of you 💖
            </p>
            <Link to="/login">
              <Button 
                data-testid="cta-create-btn"
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg"
              >
                Create Your Valentine Surprise
              </Button>
            </Link>
          </section>
        </main>
        
        <footer className="container max-w-6xl mx-auto px-4 py-8 mt-12 border-t border-border">
          <div className="text-center text-foreground/60 font-body text-sm">
            <p>Made with 💖 by Cupid's Prank</p>
            <p className="mt-2">© 2026 All rights reserved</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
