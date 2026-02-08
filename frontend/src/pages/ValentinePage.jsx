import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import RunawayNo from '../components/templates/RunawayNo';
import EmotionalDamage from '../components/templates/EmotionalDamage';
import GuiltTrip from '../components/templates/GuiltTrip';
import PuppyEyes from '../components/templates/PuppyEyes';
import DestinyMode from '../components/templates/DestinyMode';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ValentinePage = () => {
  const { valentineId } = useParams();
  const [valentine, setValentine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  
  useEffect(() => {
    fetchValentine();
  }, [valentineId]);
  
  const fetchValentine = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/valentines/${valentineId}`);
      setValentine(res.data);
      
      if (res.data.response) {
        setResponse(res.data.response);
      }
    } catch (error) {
      console.error('Error fetching valentine:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResponse = async (answer) => {
    try {
      await axios.post(`${BACKEND_URL}/api/valentines/${valentineId}/response`, {
        response: answer
      });
      setResponse(answer);
      
      if (answer === 'yes') {
        triggerCelebration();
      }
    } catch (error) {
      console.error('Error recording response:', error);
    }
  };
  
  const triggerCelebration = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E11D48', '#F43F5E', '#FFE4E6', '#FFFFFF']
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E11D48', '#F43F5E', '#FFE4E6', '#FFFFFF']
      });
    }, 50);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-body">Loading your surprise...</p>
        </div>
      </div>
    );
  }
  
  if (!valentine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Valentine not found
          </h1>
          <p className="text-foreground/70 font-body">This link might be invalid or expired</p>
        </div>
      </div>
    );
  }
  
  if (response === 'yes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0
              }}
              animate={{ 
                y: window.innerHeight + 50,
                rotate: 360
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              💖
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-9xl mb-8"
          >
            💕
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-heading font-bold text-foreground mb-6">
            Yay! They said <span className="text-primary italic">YES!</span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-floating max-w-lg mx-auto"
          >
            <p className="text-xl font-body text-foreground mb-4">
              "{valentine.message}"
            </p>
            <p className="text-foreground/70 font-body">
              - {valentine.from_name} 💖
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }
  
  const templateComponents = {
    'runaway_no': RunawayNo,
    'emotional_damage': EmotionalDamage,
    'guilt_trip': GuiltTrip,
    'puppy_eyes': PuppyEyes,
    'destiny_mode': DestinyMode
  };
  
  const TemplateComponent = templateComponents[valentine.template_id];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 paper-texture"></div>
      
      {TemplateComponent && (
        <TemplateComponent
          valentine={valentine}
          onResponse={handleResponse}
        />
      )}
    </div>
  );
};

export default ValentinePage;
