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
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <img 
            src="https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/9fqt9wyl_face4.svg"
            alt="Character with puppy eyes"
            className="h-32 w-32 mx-auto"
          />
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          {valentine.to_name}... 💕
        </h1>
        
        <div className="bg-white rounded-[3rem] p-8 shadow-cartoon border-4 border-foreground/10 mb-8">
          <p className="text-xl lg:text-3xl font-body text-foreground mb-6">
            {valentine.message}
          </p>
          <p className="text-xl text-foreground/70 font-accent text-2xl">
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
                className="w-64 h-64 object-cover rounded-[3rem] mx-auto shadow-cartoon border-4 border-foreground/10"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-accent text-primary mt-6 bg-white rounded-3xl p-4 shadow-cartoon inline-block"
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
            className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-110 transition-all"
          >
            <Heart className="mr-2 h-7 w-7 fill-white" />
            Yes! 💕
          </Button>
          
          <Button
            data-testid="no-button"
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-white hover:bg-gray-50 border-4"
          >
            No
          </Button>
        </div>
        
        {!showPuppy && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-lg font-body text-foreground/60 bg-white rounded-3xl p-4 shadow-cartoon inline-block"
          >
            (Hover over "No" if you dare... 🐶)
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PuppyEyes;