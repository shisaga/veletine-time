import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const RunawayNo = ({ valentine, onResponse }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const noButtonRef = useRef(null);
  
  const moveNoButton = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    
    setNoPosition({ x: newX, y: newY });
  };
  
  const messages = [
    "Wait! Think about it...",
    "Are you sure? 🥺",
    "Really? You're breaking my heart...",
    "One more chance?",
    "Pretty please? 💕"
  ];
  
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-8"
        >
          💖
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          Hey {valentine.to_name}! 💕
        </h1>
        
        <div className="bg-white rounded-[3rem] p-8 shadow-cartoon border-4 border-foreground/10 mb-8">
          <p className="text-xl lg:text-3xl font-body text-foreground mb-6">
            {valentine.message}
          </p>
          <p className="text-xl text-foreground/70 font-accent text-2xl">
            - {valentine.from_name}
          </p>
        </div>
        
        {attempts > 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-accent text-primary mb-6 bg-white rounded-3xl p-4 shadow-cartoon inline-block"
          >
            {messages[Math.min(attempts - 1, messages.length - 1)]}
          </motion.p>
        )}
        
        <div className="flex gap-4 justify-center items-center relative" style={{ minHeight: '80px' }}>
          <Button
            data-testid="yes-button"
            onClick={() => onResponse('yes')}
            size="lg"
            className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-110 transition-all"
          >
            <Heart className="mr-2 h-7 w-7 fill-white" />
            Yes! 💕
          </Button>
          
          <motion.div
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{ left: '60%' }}
          >
            <Button
              data-testid="no-button"
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-white hover:bg-gray-50 border-4"
            >
              No
            </Button>
          </motion.div>
        </div>
        
        {attempts > 3 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-lg font-body text-foreground/60 bg-white rounded-3xl p-4 shadow-cartoon inline-block"
          >
            (Psst... the No button is playing hard to get 😉)
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default RunawayNo;