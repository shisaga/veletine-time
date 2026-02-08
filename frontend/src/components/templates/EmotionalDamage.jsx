import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const EmotionalDamage = ({ valentine, onResponse }) => {
  const [hovering, setHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const sadMessages = [
    "Really? 🥺",
    "My heart is breaking... 💔",
    "I already told my friends about you...",
    "Even practiced what to say...",
    "Okay... I understand... 😢"
  ];
  
  const handleNoHover = () => {
    setHovering(true);
  };
  
  const handleNoLeave = () => {
    setHovering(false);
  };
  
  const handleNoClick = () => {
    setClickCount(prev => prev + 1);
  };
  
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-0"
          />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: hovering ? 0.6 : 1, 
          y: 0,
          scale: hovering ? 0.95 : 1
        }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          animate={{ 
            scale: hovering ? [1, 0.8, 1] : [1, 1.1, 1],
            rotate: hovering ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.5, repeat: hovering ? Infinity : 0 }}
          className="text-6xl mb-8"
        >
          {hovering || clickCount > 0 ? '😢' : '💖'}
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          {valentine.to_name}, will you be mine? 💕
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-floating mb-8">
          <p className="text-xl lg:text-2xl font-body text-foreground mb-6">
            {valentine.message}
          </p>
          <p className="text-lg text-foreground/70 font-accent">
            - {valentine.from_name}
          </p>
        </div>
        
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <p className="text-xl font-accent text-primary mb-2">
                {sadMessages[Math.min(clickCount - 1, sadMessages.length - 1)]}
              </p>
              {clickCount > 2 && (
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  src="https://images.unsplash.com/photo-1651044204351-f0a6aab96e3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcHVwcHklMjBleWVzJTIwZG9nfGVufDB8fHx8MTc3MDU3MzAzNnww&ixlib=rb-4.1.0&q=85"
                  alt="Sad puppy"
                  className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
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
            onMouseEnter={handleNoHover}
            onMouseLeave={handleNoLeave}
            onClick={handleNoClick}
            variant="outline"
            size="lg"
            className="rounded-full px-12 py-6 text-xl"
          >
            No
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotionalDamage;