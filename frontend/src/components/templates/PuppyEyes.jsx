import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const PuppyEyes = ({ valentine, onResponse }) => {
  const [showPuppy, setShowPuppy] = useState(false);
  
  const handleNoHover = () => {
    setShowPuppy(true);
  };
  
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-8"
        >
          🐶
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          {valentine.to_name}... 💕
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
          {showPuppy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mb-8"
            >
              <motion.img
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [-2, 2, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                src="https://images.unsplash.com/photo-1651044204351-f0a6aab96e3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcHVwcHklMjBleWVzJTIwZG9nfGVufDB8fHx8MTc3MDU3MzAzNnww&ixlib=rb-4.1.0&q=85"
                alt="Puppy with big eyes"
                className="w-64 h-64 object-cover rounded-3xl mx-auto shadow-floating"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-accent text-primary mt-6"
              >
                How can you say no to THIS face? 🥺
              </motion.p>
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
            onTouchStart={handleNoHover}
            variant="outline"
            size="lg"
            className="rounded-full px-12 py-6 text-xl"
          >
            No
          </Button>
        </div>
        
        {!showPuppy && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-sm font-body text-foreground/60"
          >
            (Hover over "No" if you dare... 🐶)
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PuppyEyes;