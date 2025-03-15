
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CalendarDays, 
  DollarSign, 
  Users, 
  MapPin, 
  Star, 
  Clock, 
  Plane,
  Utensils
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatIndianRupees } from '@/lib/utils';

export interface TripResultsProps {
  loading: boolean;
  tripData?: TripData;
  error?: string;
}

export interface TripData {
  destination: string;
  summary: string;
  budget: {
    total: number;
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
  duration: number;
  itinerary: ItineraryDay[];
  tips: string[];
  foodSuggestions?: FoodSuggestion[];
  transportation?: {
    flights: Flight[];
    localTransportation: string[];
  };
}

export interface FoodSuggestion {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ItineraryDay {
  day: number;
  activities: {
    time: string;
    activity: string;
    description: string;
    location?: string;
    cost?: number;
  }[];
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  price: number;
  duration: string;
}

const TripResults: React.FC<TripResultsProps> = ({ loading, tripData, error }) => {
  if (loading) {
    return <TripResultsSkeleton />;
  }

  if (error) {
    return (
      <Card className="glass-panel border-0 shadow-glass animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-destructive">Error Planning Trip</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">{error}</p>
            <Button className="mt-6 bg-primary hover:bg-primary/90">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tripData) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="glass-panel border-0 shadow-glass">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="text-sm font-normal">Your Trip</Badge>
              </div>
              <CardTitle className="text-3xl font-medium">
                {tripData.destination}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {tripData.summary}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-4">
              <TripStat 
                icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />}
                label="Duration"
                value={`${tripData.duration} Days`}
              />
              <TripStat 
                icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
                label="Total Budget"
                value={`₹${formatIndianRupees(tripData.budget.total)}`}
              />
              <TripStat 
                icon={<Users className="h-5 w-5 text-muted-foreground" />}
                label="Cost Per Person"
                value={`₹${formatIndianRupees(Math.round(tripData.budget.total / 2))}`}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget Breakdown</TabsTrigger>
              {tripData.transportation && (
                <TabsTrigger value="transportation">Transportation</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="itinerary" className="space-y-6">
              {tripData.itinerary.map((day) => (
                <ItineraryDayCard key={day.day} day={day} />
              ))}
              
              {/* Food Suggestions Section */}
              {tripData.foodSuggestions && tripData.foodSuggestions.length > 0 && (
                <div className="bg-secondary/50 rounded-xl p-6 mt-6">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" /> 
                    Local Food Suggestions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tripData.foodSuggestions.map((food, index) => (
                      <div key={index} className="bg-background/80 rounded-lg overflow-hidden border border-border/30 hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img 
                            src={food.imageUrl} 
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-base">{food.name}</h4>
                            <Badge variant="outline" className="font-normal">
                              ₹{formatIndianRupees(food.price)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{food.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-secondary/50 rounded-xl p-6 mt-6">
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" /> 
                  Travel Tips
                </h3>
                <ul className="space-y-2">
                  {tripData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 rounded-full h-6 w-6 flex items-center justify-center bg-primary/10 text-primary text-sm mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-muted-foreground">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="budget">
              <div className="space-y-4">
                <BudgetCard 
                  category="Accommodation" 
                  amount={tripData.budget.accommodation} 
                  total={tripData.budget.total} 
                />
                <BudgetCard 
                  category="Food & Dining" 
                  amount={tripData.budget.food} 
                  total={tripData.budget.total} 
                />
                <BudgetCard 
                  category="Activities & Attractions" 
                  amount={tripData.budget.activities} 
                  total={tripData.budget.total} 
                />
                <BudgetCard 
                  category="Transportation" 
                  amount={tripData.budget.transportation} 
                  total={tripData.budget.total} 
                />
                
                <div className="flex justify-between items-center py-4 px-6 rounded-lg bg-primary/5 mt-6">
                  <span className="font-medium">Total Budget</span>
                  <span className="font-medium">₹{formatIndianRupees(tripData.budget.total)}</span>
                </div>
              </div>
            </TabsContent>
            
            {tripData.transportation && (
              <TabsContent value="transportation">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" /> 
                      Flight Options
                    </h3>
                    <div className="space-y-4">
                      {tripData.transportation.flights.map((flight, index) => (
                        <FlightCard key={index} flight={flight} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Local Transportation</h3>
                    <ul className="space-y-2">
                      {tripData.transportation.localTransportation.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 rounded-full h-6 w-6 flex items-center justify-center bg-primary/10 text-primary text-sm mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-muted-foreground">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const TripStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center bg-secondary/50 p-3 rounded-lg min-w-[100px]">
    <div className="mb-1">{icon}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

const ItineraryDayCard = ({ day }: { day: ItineraryDay }) => (
  <Card className="overflow-hidden border border-border/50">
    <CardHeader className="bg-secondary/30 pb-3">
      <CardTitle className="text-lg">Day {day.day}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="relative pl-6 ml-6 border-l border-dashed border-border">
        {day.activities.map((activity, index) => (
          <div key={index} className="relative py-4 px-6">
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center -translate-x-[27px]">
              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-normal px-2 py-0 h-5">
                  {activity.time}
                </Badge>
                <h3 className="font-medium">{activity.activity}</h3>
              </div>
              {activity.location && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" /> {activity.location}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            {activity.cost && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" /> Est. Cost: ₹{formatIndianRupees(activity.cost)}
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const BudgetCard = ({ category, amount, total }: { category: string; amount: number; total: number }) => {
  const percentage = Math.round((amount / total) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">{category}</span>
        <span className="text-sm font-medium">₹{formatIndianRupees(amount)}</span>
      </div>
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">{percentage}% of total</span>
      </div>
    </div>
  );
};

const FlightCard = ({ flight }: { flight: Flight }) => (
  <Card className="overflow-hidden border border-border/50">
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{flight.airline}</div>
            <div className="font-medium">{flight.flightNumber}</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
          <div className="text-center">
            <div className="font-medium">{flight.departure.time}</div>
            <div className="text-xs text-muted-foreground">{flight.departure.airport}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {flight.duration}
            </div>
            <div className="relative w-20 md:w-32">
              <Separator className="absolute top-1/2 w-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-medium">{flight.arrival.time}</div>
            <div className="text-xs text-muted-foreground">{flight.arrival.airport}</div>
          </div>
        </div>
        
        <div className="md:text-right">
          <div className="text-sm text-muted-foreground">Price</div>
          <div className="font-medium">₹{formatIndianRupees(flight.price)}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TripResultsSkeleton = () => (
  <Card className="glass-panel border-0 shadow-glass animate-pulse">
    <CardHeader className="pb-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-slate-200 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
          </div>
          <div className="h-9 w-64 bg-slate-200 rounded-lg mb-2" />
          <div className="h-5 w-full bg-slate-200 rounded-lg" />
          <div className="h-5 w-4/5 bg-slate-200 rounded-lg mt-2" />
        </div>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-200 h-20 w-28 rounded-lg" />
          ))}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="h-10 w-full bg-slate-200 rounded-lg mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((day) => (
          <div key={day} className="bg-slate-200 h-48 w-full rounded-lg" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TripResults;
