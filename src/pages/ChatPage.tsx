
import React from 'react';
import { Bot, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import ChatBot from '@/components/ChatBot';
import SettingsDialog from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <Header rightContent={<SettingsDialog />} />
      
      <main className="pt-24 pb-20">
        <div className="container-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium mb-6 text-primary">
              <Bot className="h-4 w-4" />
              AI Travel Assistant
            </div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4 bg-gradient-to-r from-primary to-blue-700 text-transparent bg-clip-text">Chat with Your Travel AI</h2>
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
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
              <ChatBot />
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-white/50 backdrop-blur-sm py-12 border-t border-white/20">
        <div className="container-inner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Bot className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-medium bg-gradient-to-r from-primary to-blue-700 text-transparent bg-clip-text">JourneyGenius</span>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/chat" className="text-sm text-primary font-medium">
                Chat
              </Link>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} JourneyGenius. Powered by Gemini AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
