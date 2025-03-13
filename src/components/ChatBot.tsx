
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Plus, Bot, User, X } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { sendMessageToGemini } from '@/utils/geminiApi';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  destination?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ destination = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Add welcome message when component mounts or destination changes
  useEffect(() => {
    if (destination) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your travel assistant for ${destination}. Ask me anything about attractions, local customs, food recommendations, or travel tips!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      const defaultWelcome: Message = {
        id: 'default-welcome',
        role: 'assistant',
        content: "Hi there! I'm your AI travel assistant. Once you've chosen a destination, I can help with personalized recommendations and answer questions about your trip!",
        timestamp: new Date(),
      };
      setMessages([defaultWelcome]);
    }
  }, [destination]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessageToGemini(input, destination);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (destination) {
      const welcomeMessage: Message = {
        id: 'welcome-new',
        role: 'assistant',
        content: `Let's start a new conversation about ${destination}. How can I help you?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      const defaultWelcome: Message = {
        id: 'default-welcome-new',
        role: 'assistant',
        content: "Let's start a new conversation. How can I help with your travel plans?",
        timestamp: new Date(),
      };
      setMessages([defaultWelcome]);
    }
  };

  const suggestedQuestions = [
    "What are the must-see attractions?",
    "What's the best time to visit?",
    "Local food specialties I should try?",
    "Is it safe for tourists?",
    "What's the local transport like?",
    "Hidden gems most tourists miss?"
  ];

  return (
    <Card className="glass-panel border-0 shadow-glass h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Travel Assistant
        </CardTitle>
        {messages.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={clearChat}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear chat</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 min-h-[300px] md:min-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={message.role === "assistant" ? "secondary" : "default"}
                  className="h-6 px-2 text-xs font-normal flex items-center gap-1"
                >
                  {message.role === "assistant" ? (
                    <>
                      <Bot className="h-3 w-3" /> Assistant
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" /> You
                    </>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[85%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Suggested questions at the start */}
          {messages.length <= 1 && (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setInput(question);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start">
              <div className="rounded-lg px-4 py-2 bg-muted">
                <div className="flex space-x-2 items-center">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your travel question..."
            className="min-h-10 resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
