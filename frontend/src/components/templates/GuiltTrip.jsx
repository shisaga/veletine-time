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
            scale: noClicks > 0 ? [1, 0.9, 1] : [1, 1.15, 1],
            rotate: noClicks > 2 ? [-5, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img 
            src={noClicks > 3 
              ? "https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/v6n5belr_face2.svg"
              : noClicks > 0 
              ? "https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/xf1uempv_face3.svg"
              : "https://customer-assets.emergentagent.com/job_heartlinks-2/artifacts/hkh1cha6_face1.svg"
            }
            alt="Character emotion"
            className="h-32 w-32 mx-auto"
          />
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          {valentine.to_name}, Be My Valentine? 💕
        </h1>
        
        <div className="bg-white rounded-[3rem] p-8 shadow-cartoon border-4 border-foreground/10 mb-8">
          <p className="text-xl lg:text-3xl font-body text-foreground mb-6">
            {valentine.message}
          </p>
          <p className="text-xl text-foreground/70 font-accent text-2xl">
            - {valentine.from_name}
          </p>
        </div>
        
        {noClicks > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <p className="text-2xl font-accent text-primary mb-4 bg-white rounded-3xl p-4 shadow-cartoon inline-block">
              {messages[noClicks]}
            </p>
            {noClicks > 2 && (
              <p className="text-lg text-foreground/70 font-body bg-white rounded-3xl p-4 shadow-cartoon inline-block mt-4">
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
              className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-110 transition-all text-white"
              style={{ fontSize: `${1 + noClicks * 0.15}rem` }}
            >
              <Heart className="mr-2 h-7 w-7 fill-white" />
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
              className="cartoon-border rounded-full px-14 py-7 text-2xl font-heading font-bold bg-white hover:bg-gray-50 border-4"
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
            className="mt-8 text-lg font-body text-foreground/60 bg-white rounded-3xl p-4 shadow-cartoon inline-block"
          >
            The No button has given up. Maybe you should too? 😊
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default GuiltTrip;