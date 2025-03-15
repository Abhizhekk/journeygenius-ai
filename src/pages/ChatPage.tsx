
import React from 'react';
import { Bot } from 'lucide-react';
import Header from '@/components/Header';
import ChatBot from '@/components/ChatBot';
import SettingsDialog from '@/components/SettingsDialog';
import { motion } from 'framer-motion';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header rightContent={<SettingsDialog />} />
      
      <main className="pt-24 pb-20">
        <section className="page-section">
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
              <ChatBot />
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary/30 py-12">
        <div className="container-inner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Bot className="h-6 w-6 text-primary mr-2" strokeWidth={2.5} />
              <span className="text-xl font-medium">JourneyGenius Chat</span>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} JourneyGenius. Powered by Gemini AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
