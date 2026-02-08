import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const DestinyMode = ({ valentine, onResponse }) => {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleNoClick = () => {
    setChecking(true);
    
    setTimeout(() => {
      setResult('yes');
      setChecking(false);
    }, 3000);
  };
  
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {checking ? (
          <motion.div
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-8"
            >
              🔮
            </motion.div>
            
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Checking destiny...
            </h2>
            
            <div className="flex gap-2 justify-center mb-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-3 w-3 bg-primary rounded-full"
                />
              ))}
            </div>
            
            <p className="text-foreground/70 font-body">The universe is aligning...</p>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-8"
            >
              ✨
            </motion.div>
            
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-10 shadow-floating mb-8">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
                Destiny Has Spoken!
              </h2>
              <p className="text-2xl text-primary font-accent mb-6">
                You are meant to say YES 💖
              </p>
              <p className="text-foreground/70 font-body">
                The stars have aligned. The universe has decided. Your fate is sealed.
              </p>
            </div>
            
            <Button
              data-testid="yes-button-destiny"
              onClick={() => onResponse('yes')}
              size="lg"
              className="rounded-full px-16 py-8 text-2xl shadow-floating hover:scale-110 transition-all animate-pulse"
            >
              <Heart className="mr-3 h-8 w-8 fill-white" />
              Accept Destiny 💕
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-8"
            >
              🌠
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              {valentine.to_name}, The Stars Are Watching ✨
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-floating mb-8">
              <p className="text-xl lg:text-2xl font-body text-foreground mb-6">
                {valentine.message}
              </p>
              <p className="text-lg text-foreground/70 font-accent">
                - {valentine.from_name}
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                data-testid="yes-button"
                onClick={() => onResponse('yes')}
                size="lg"
                className="rounded-full px-12 py-6 text-xl shadow-floating hover:scale-110 transition-all"
              >
                <Heart className="mr-2 h-6 w-6 fill-white" />
                Yes! 💕
              </Button>
              
              <Button
                data-testid="no-button"
                onClick={handleNoClick}
                variant="outline"
                size="lg"
                className="rounded-full px-12 py-6 text-xl"
              >
                No
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinyMode;