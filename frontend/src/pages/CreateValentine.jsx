import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CreateValentine = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    from_name: '',
    to_name: '',
    message: '',
    emoji_style: 'cute',
    background_theme: 'pink'
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      toast.error('Please pick a template! 🎭');
      return;
    }
    
    if (!formData.from_name || !formData.to_name || !formData.message) {
      toast.error('Fill in all fields! ✏️');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/valentines`,
        {
          ...formData,
          template_id: selectedTemplate
        },
        { withCredentials: true }
      );
      
      toast.success('Valentine created! 🎉');
      navigate(`/payment/${response.data.valentine_id}`);
    } catch (error) {
      console.error('Error creating valentine:', error);
      toast.error('Oops! Try again 😢');
    } finally {
      setLoading(false);
    }
  };
  
  const templateEmojis = {
    'runaway_no': '🏃',
    'emotional_damage': '😭',
    'guilt_trip': '🙏',
    'puppy_eyes': '🐶',
    'destiny_mode': '✨'
  };
  
  return (
    <div className="min-h-screen cartoon-bg relative overflow-hidden">
      <div className="relative z-10">
        <header className="container max-w-6xl mx-auto px-4 py-6 flex items-center gap-4 mb-4">
          <Button 
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')} 
            className="cartoon-border rounded-full h-14 w-14 p-0 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-cartoon animate-bounce">
              <Heart className="h-7 w-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-heading font-bold text-foreground">Create Valentine</span>
          </div>
        </header>
        
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-cartoon border-4 border-foreground/10">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">
                Pick Your <span className="text-primary">Prank!</span> 🎭
              </h2>
              <p className="text-center text-foreground/70 font-body mb-6">Choose the funniest way to ask!</p>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.template_id}
                    data-testid={`template-${template.template_id}`}
                    type="button"
                    onClick={() => setSelectedTemplate(template.template_id)}
                    className={`text-left bg-gradient-to-br rounded-3xl p-6 transition-all duration-300 ${
                      selectedTemplate === template.template_id
                        ? 'from-primary to-pink-400 text-white shadow-floating scale-105 border-4 border-foreground'
                        : 'from-white to-gray-50 text-foreground shadow-cartoon border-4 border-foreground/10 hover:scale-105'
                    }`}
                  >
                    <div className="text-4xl mb-3">{templateEmojis[template.template_id]}</div>
                    <h3 className="text-xl font-heading font-bold mb-2">
                      {template.name}
                    </h3>
                    <p className={`text-sm font-body ${
                      selectedTemplate === template.template_id ? 'text-white/90' : 'text-foreground/70'
                    }`}>
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-[3rem] p-8 shadow-cartoon border-4 border-foreground/10">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6 text-center">
                Make It <span className="text-primary">Personal!</span> 💕
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from_name" className="text-foreground font-heading font-semibold text-lg mb-2 block">
                      Your Name 😊
                    </Label>
                    <Input
                      id="from_name"
                      data-testid="from-name-input"
                      value={formData.from_name}
                      onChange={(e) => setFormData({...formData, from_name: e.target.value})}
                      placeholder="Your name"
                      className="rounded-2xl h-14 text-lg border-4 border-foreground/10 font-body"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="to_name" className="text-foreground font-heading font-semibold text-lg mb-2 block">
                      Their Name 💖
                    </Label>
                    <Input
                      id="to_name"
                      data-testid="to-name-input"
                      value={formData.to_name}
                      onChange={(e) => setFormData({...formData, to_name: e.target.value})}
                      placeholder="Their name"
                      className="rounded-2xl h-14 text-lg border-4 border-foreground/10 font-body"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-foreground font-heading font-semibold text-lg mb-2 block">
                    Your Sweet Message 💌
                  </Label>
                  <Textarea
                    id="message"
                    data-testid="message-input"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write something sweet..."
                    rows={4}
                    className="rounded-2xl resize-none text-lg border-4 border-foreground/10 font-body"
                  />
                </div>
              </div>
            </div>
            
            <Button
              data-testid="continue-payment-btn"
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full cartoon-border rounded-full py-7 text-2xl font-heading font-bold bg-primary hover:bg-primary/90 shadow-floating hover:scale-105 transition-all"
            >
              {loading ? 'Creating... ⏳' : 'Continue to Payment ₹15 💖'}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateValentine;
