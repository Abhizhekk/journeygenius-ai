
import React, { useState } from 'react';
import { CalendarIcon, Users, Plane, MapPin, PlaneTakeoff, PlaneLanding, Briefcase, Heart } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { formatDistance } from 'date-fns';

interface TravelFormProps {
  onSubmit: (formData: TravelFormData) => void;
  isLoading: boolean;
}

export interface TravelFormData {
  source: string;
  destination: string;
  date: Date;
  budget: number;
  travelers: number;
  interests: string;
  showTransportation: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    date: new Date(),
    budget: 1000,
    travelers: 1,
    interests: '',
    showTransportation: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleBudgetChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, budget: value[0] }));
  };

  const handleTravelersChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, travelers: value[0] }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.source && formData.destination;
  const timeUntilTrip = formatDistance(formData.date, new Date(), { addSuffix: true });

  return (
    <Card className="w-full glass-panel border-0 shadow-glass transition-all duration-500 hover:shadow-glass-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
                Departure Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Where are you departing from?"
                  className="pl-10 form-input"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <PlaneLanding className="h-4 w-4 text-muted-foreground" />
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Where would you like to go?"
                  className="pl-10 form-input"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Travel Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "form-input w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formData.date ? (
                      <span>{formData.date.toLocaleDateString()}</span>
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-morphism" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-xs text-muted-foreground">
                Trip {timeUntilTrip}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Budget (USD)
              </label>
              <div className="pt-3 px-2">
                <Slider
                  defaultValue={[1000]}
                  min={100}
                  max={10000}
                  step={100}
                  value={[formData.budget]}
                  onValueChange={handleBudgetChange}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>${formData.budget}</span>
                  <span className="text-muted-foreground text-xs">Up to $10,000</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Number of Travelers
              </label>
              <div className="pt-3 px-2">
                <Slider
                  defaultValue={[1]}
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.travelers]}
                  onValueChange={handleTravelersChange}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>{formData.travelers} {formData.travelers === 1 ? 'Person' : 'People'}</span>
                  <span className="text-muted-foreground text-xs">Max 10 people</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              Interests
            </label>
            <Input
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              placeholder="Nature, Culture, Adventure, Food, History, etc."
              className="form-input"
            />
            <div className="text-xs text-muted-foreground">
              Comma-separated list of interests to personalize your recommendations
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="transportation" 
              checked={formData.showTransportation}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, showTransportation: checked === true }))
              }
            />
            <label
              htmlFor="transportation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Plane className="h-4 w-4 text-muted-foreground" />
              Include transportation details
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-primary" 
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Planning Your Journey...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" /> Plan My Trip
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelForm;
