
import React, { useState, useEffect } from 'react';
import { CalendarDays, Plane, Bot, MapPin, Image } from 'lucide-react';
import Header from '@/components/Header';
import TravelForm from '@/components/TravelForm';
import TripResults from '@/components/TripResults';
import MapEmbed from '@/components/Map';
import PhotoGallery from '@/components/PhotoGallery';
import ChatBot from '@/components/ChatBot';
import { generateTravelPlan } from '@/utils/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { TravelFormData } from '@/components/TravelForm';
import type { TripData } from '@/components/TripResults';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [destination, setDestination] = useState<string>('');
  const { toast } = useToast();

  // Check for API keys on component mount
  useEffect(() => {
    const geminiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) {
      // Show API key setup prompt
      setTimeout(() => {
        showApiKeySetupToast();
      }, 1000);
    }
  }, []);

  const showApiKeySetupToast = () => {
    toast({
      title: "API Key Setup Required",
      description: "Please enter your Gemini API key in the form below to enable all features.",
      duration: 6000,
    });
  };

  const handleFormSubmit = async (formData: TravelFormData) => {
    setIsLoading(true);
    setError(undefined);
    setDestination(formData.destination);
    
    try {
      const planData = await generateTravelPlan(formData);
      setTripData(planData);
      
      toast({
        title: "Trip Planned Successfully!",
        description: `Your journey to ${formData.destination} has been planned.`,
      });
    } catch (err) {
      console.error('Error planning trip:', err);
      setError('Sorry, we encountered an issue while planning your trip. Please try again or check your API keys.');
      
      toast({
        title: "Error Planning Trip",
        description: "Failed to generate travel plan. Please check your API key or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [geminiApiKey, setGeminiApiKey] = useState<string>(
    localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
  );
  const [serpApiKey, setSerpApiKey] = useState<string>(
    localStorage.getItem('serp_api_key') || import.meta.env.VITE_SERP_API_KEY || ''
  );
  const [showApiForm, setShowApiForm] = useState<boolean>(!geminiApiKey);

  const handleSaveApiKeys = () => {
    if (geminiApiKey) {
      localStorage.setItem('gemini_api_key', geminiApiKey);
    }
    
    if (serpApiKey) {
      localStorage.setItem('serp_api_key', serpApiKey);
    }
    
    setShowApiForm(false);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section id="home" className="page-section py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container-inner text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Plane className="h-4 w-4" />
              Intelligent AI Travel Planning
            </div>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-tight">
              Plan Your Perfect Trip with <br className="hidden md:block" />
              <span className="text-primary">AI-Powered</span> Intelligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Tell us where you want to go, and our AI assistant will create a personalized itinerary 
              with budget insights, local recommendations, and hidden gems.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#planner"
                className="btn-primary"
              >
                Plan My Trip
              </a>
              <a 
                href="#chat"
                className="btn-secondary"
              >
                Chat with AI Assistant
              </a>
            </div>
          </motion.div>
        </section>
        
        {/* API Key Setup Form */}
        {showApiForm && (
          <section className="page-section py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="container-inner max-w-2xl"
            >
              <div className="glass-panel mb-12">
                <h2 className="text-2xl font-medium mb-6">API Key Setup</h2>
                <p className="text-muted-foreground mb-6">
                  To use all features of this application, please enter your API keys below:
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Gemini API Key (Required)
                    </label>
                    <input
                      type="text"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSyA..."
                      className="form-input w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your key from{' '}
                      <a 
                        href="https://ai.google.dev/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      SerpAPI Key (Optional - For Flight Information)
                    </label>
                    <input
                      type="text"
                      value={serpApiKey}
                      onChange={(e) => setSerpApiKey(e.target.value)}
                      placeholder="f408da..."
                      className="form-input w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your key from{' '}
                      <a 
                        href="https://serpapi.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        SerpAPI
                      </a>
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleSaveApiKeys}
                    disabled={!geminiApiKey}
                    className="btn-primary w-full"
                  >
                    Save API Keys
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        )}
        
        {/* Trip Planner Section */}
        <section id="planner" className="page-section">
          <div className="container-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <CalendarDays className="h-4 w-4" />
                Trip Planner
              </div>
              <h2 className="text-3xl md:text-4xl font-medium mb-4">Create Your Perfect Itinerary</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill in your travel details, and our AI will craft a personalized travel plan that fits your schedule, budget, and interests.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </motion.div>
            
            {(isLoading || tripData || error) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                <TripResults 
                  loading={isLoading} 
                  tripData={tripData} 
                  error={error} 
                />
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Map & Photo Section */}
        {destination && (
          <section id="gallery" className="page-section">
            <div className="container-inner">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <Image className="h-4 w-4" />
                  Destination Visuals
                </div>
                <h2 className="text-3xl md:text-4xl font-medium mb-4">Explore {destination}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get a glimpse of your destination with maps and beautiful photos.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <MapEmbed location={destination} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <PhotoGallery location={destination} />
                </motion.div>
              </div>
            </div>
          </section>
        )}
        
        {/* Chat Assistant Section */}
        <section id="chat" className="page-section">
          <div className="container-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Bot className="h-4 w-4" />
                Virtual Assistant
              </div>
              <h2 className="text-3xl md:text-4xl font-medium mb-4">Chat with Your Travel AI</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ask questions, get recommendations, and learn more about your destination with our AI assistant.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <ChatBot destination={destination} />
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary/30 py-12">
        <div className="container-inner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Plane className="h-6 w-6 text-primary mr-2" strokeWidth={2.5} />
              <span className="text-xl font-medium">JourneyGenius</span>
            </div>
            
            <div className="flex space-x-8">
              <a href="#home" className="text-sm text-muted-foreground hover:text-foreground">Home</a>
              <a href="#planner" className="text-sm text-muted-foreground hover:text-foreground">Trip Planner</a>
              <a href="#chat" className="text-sm text-muted-foreground hover:text-foreground">AI Assistant</a>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowApiForm(true);
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                API Settings
              </a>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} JourneyGenius. Powered by Gemini AI.</p>
            <p className="mt-2">This app uses Gemini AI, Unsplash for images, and Mapbox for maps.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
