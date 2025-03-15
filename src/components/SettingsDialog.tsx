
import React, { useState } from 'react';
import { Settings, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyType, saveApiKey, getApiKey } from "@/utils/apiKeyUtils";
import { useToast } from "@/hooks/use-toast";

const ApiKeyField = ({ 
  keyType, 
  label, 
  description,
  placeholderText,
  docsUrl
}: { 
  keyType: ApiKeyType; 
  label: string;
  description: string;
  placeholderText: string;
  docsUrl: string;
}) => {
  const [key, setKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSave = () => {
    saveApiKey(keyType, key);
    setKey('');
    toast({
      title: "API Key Saved",
      description: `Your ${label} has been saved successfully.`,
    });
  };

  const hasExistingKey = Boolean(getApiKey(keyType));

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor={keyType}>{label}</Label>
        <div className="flex gap-2">
          <Input
            id={keyType}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            type={showKey ? "text" : "password"}
            placeholder={hasExistingKey ? "••••••••••••••••" : placeholderText}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
            size="icon"
          >
            {showKey ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {description} Get your key from{' '}
        <a 
          href={docsUrl}
          target="_blank" 
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          here
        </a>.
        {hasExistingKey && (
          <div className="mt-1 text-sm text-green-600">
            ✓ API key is configured
          </div>
        )}
      </div>
      <Button 
        onClick={handleSave} 
        disabled={!key.trim()}
        className="w-full"
      >
        Save {label}
      </Button>
    </div>
  );
};

const SettingsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and application preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="api-keys">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex items-center gap-2 mb-4 pt-2">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="font-medium">API Keys Configuration</h3>
            </div>
            
            <div className="p-4 bg-muted/40 rounded-lg mb-4">
              <p className="text-sm">
                <strong>Note:</strong> Default API keys are already provided for demo purposes. 
                You only need to add your own keys if you want to use your personal API quotas.
              </p>
            </div>
            
            <ApiKeyField 
              keyType="gemini_api_key"
              label="Gemini API Key"
              description="Used for AI trip planning and chatbot functionality."
              placeholderText="AIzaSyA..."
              docsUrl="https://ai.google.dev/"
            />
            
            <ApiKeyField 
              keyType="serp_api_key"
              label="SerpAPI Key"
              description="Used for flight information and search capabilities."
              placeholderText="f408da..."
              docsUrl="https://serpapi.com/"
            />
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="py-4 text-center text-muted-foreground">
              Preferences options will be added in a future update.
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" className="w-full mt-2">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
