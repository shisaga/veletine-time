import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gift, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
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
                  Pay just ₹15, get your link & watch the FUN unfold! 🎊
                </p>
              </div>
            </div>
          </section>
          
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-pink-400 to-purple-500 rounded-[3rem] shadow-cartoon"></div>
            <div className="relative bg-gradient-to-br from-primary via-pink-400 to-purple-500 rounded-[3rem] p-12 text-center shadow-cartoon border-4 border-foreground/20">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/eye8k9ce_lincoln.png"
                  alt="Cupid"
                  className="h-24 w-24 animate-bounce"
                />
              </div>
              
              <Zap className="h-20 w-20 text-white mx-auto mb-6 mt-8 drop-shadow-lg" />
              <h2 className="text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
                Valentine's Special! 💝
              </h2>
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-7xl font-heading font-bold text-white drop-shadow-lg">₹15</span>
                <span className="text-2xl text-white/90 font-body">/ link</span>
              </div>
              <p className="text-white text-xl font-body mb-8 max-w-2xl mx-auto drop-shadow">
                One coffee for you = a FOREVER memory for both of you! 💖✨
              </p>
              <Link to="/login">
                <Button 
                  data-testid="cta-create-btn"
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 rounded-full px-12 py-7 text-2xl font-heading font-bold shadow-cartoon hover:scale-110 transition-all"
                >
                  Create Your Valentine Surprise! 🎁
                </Button>
              </Link>
            </div>
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
