import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const GuiltTrip = ({ valentine, onResponse }) => {
  const [noClicks, setNoClicks] = useState(0);
  
  const messages = [
    "Are you absolutely sure?",
    "Like... REALLY sure?",
    "I even dressed up for this... 👗",
    "My mom already knows about you...",
    "I've been practicing this moment... 😭",
    "This is the last time I'm asking... 💔"
  ];
  
  const handleNoClick = () => {
    setNoClicks(prev => Math.min(prev + 1, messages.length - 1));
  };
  
  const yesButtonScale = 1 + (noClicks * 0.15);
  const noButtonScale = Math.max(1 - (noClicks * 0.1), 0.5);
  
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          animate={{ 
            scale: noClicks > 0 ? [1, 0.9, 1] : [1, 1.1, 1],
            rotate: noClicks > 2 ? [-5, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-8"
        >
          {noClicks > 3 ? '😭' : noClicks > 0 ? '🥺' : '💖'}
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          {valentine.to_name}, Be My Valentine? 💕
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-floating mb-8">
          <p className="text-xl lg:text-2xl font-body text-foreground mb-6">
            {valentine.message}
          </p>
          <p className="text-lg text-foreground/70 font-accent">
            - {valentine.from_name}
          </p>
        </div>
        
        {noClicks > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <p className="text-2xl font-accent text-primary mb-4">
              {messages[noClicks]}
            </p>
            {noClicks > 2 && (
              <p className="text-lg text-foreground/70 font-body">
                (Notice how the YES button is getting bigger? That's a sign! 😉)
              </p>
            )}
          </motion.div>
        )}
        
        <div className="flex gap-4 justify-center items-center">
          <motion.div
            animate={{ scale: yesButtonScale }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              data-testid="yes-button"
              onClick={() => onResponse('yes')}
              size="lg"
              className="rounded-full px-12 py-6 text-xl shadow-floating hover:scale-110 transition-all"
              style={{ fontSize: `${1 + noClicks * 0.15}rem` }}
            >
              <Heart className="mr-2 h-6 w-6 fill-white" />
              Yes! 💕
            </Button>
          </motion.div>
          
          <motion.div
            animate={{ scale: noButtonScale, opacity: Math.max(1 - noClicks * 0.15, 0.3) }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              data-testid="no-button"
              onClick={handleNoClick}
              variant="outline"
              size="lg"
              className="rounded-full px-12 py-6 text-xl"
              disabled={noClicks >= messages.length - 1}
            >
              No
            </Button>
          </motion.div>
        </div>
        
        {noClicks >= messages.length - 1 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-sm font-body text-foreground/60"
          >
            The No button has given up. Maybe you should too? 😊
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default GuiltTrip;