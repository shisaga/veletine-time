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
      toast.error('Please select a template');
      return;
    }
    
    if (!formData.from_name || !formData.to_name || !formData.message) {
      toast.error('Please fill in all fields');
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
      
      toast.success('Valentine created!');
      navigate(`/payment/${response.data.valentine_id}`);
    } catch (error) {
      console.error('Error creating valentine:', error);
      toast.error('Failed to create valentine');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 paper-texture"></div>
      
      <div className="relative z-10">
        <header className="container max-w-6xl mx-auto px-4 py-6 flex items-center gap-4 border-b border-border">
          <Button 
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')} 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">Create Valentine</span>
          </div>
        </header>
        
        <main className="container max-w-4xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                Choose Your <span className="italic text-primary">Prank</span> Template
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.template_id}
                    data-testid={`template-${template.template_id}`}
                    type="button"
                    onClick={() => setSelectedTemplate(template.template_id)}
                    className={`text-left bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 ${
                      selectedTemplate === template.template_id
                        ? 'border-primary shadow-floating scale-105'
                        : 'border-white/50 shadow-soft hover:border-primary/50'
                    }`}
                  >
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-foreground/70 font-body">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Personalize Your Message
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from_name" className="text-foreground font-body mb-2 block">
                      Your Name
                    </Label>
                    <Input
                      id="from_name"
                      data-testid="from-name-input"
                      value={formData.from_name}
                      onChange={(e) => setFormData({...formData, from_name: e.target.value})}
                      placeholder="Your name"
                      className="rounded-xl h-12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="to_name" className="text-foreground font-body mb-2 block">
                      Their Name
                    </Label>
                    <Input
                      id="to_name"
                      data-testid="to-name-input"
                      value={formData.to_name}
                      onChange={(e) => setFormData({...formData, to_name: e.target.value})}
                      placeholder="Their name"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-foreground font-body mb-2 block">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    data-testid="message-input"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write something sweet..."
                    rows={4}
                    className="rounded-xl resize-none"
                  />
                </div>
              </div>
            </div>
            
            <Button
              data-testid="continue-payment-btn"
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full rounded-full py-6 text-lg shadow-soft hover:shadow-floating transition-all"
            >
              {loading ? 'Creating...' : 'Continue to Payment ₹15'}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateValentine;
