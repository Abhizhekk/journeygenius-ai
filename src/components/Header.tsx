
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, Bot } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { HeaderProps } from './Header.d';

const Header: React.FC<HeaderProps> = ({ rightContent }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism backdrop-blur-xl border-b border-slate-200/20">
      <div className="container-inner py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-medium transition-opacity hover:opacity-80"
          >
            <Globe className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <span className="font-medium">JourneyGenius</span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/#home">Home</NavLink>
          <NavLink href="/#planner">Plan Trip</NavLink>
          <Link to="/chat" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 flex items-center gap-1">
            <Bot className="h-4 w-4" />
            AI Assistant
          </Link>
          <NavLink href="/#gallery">Destinations</NavLink>
        </nav>
        
        {/* Add rightContent if provided */}
        {rightContent && (
          <div className="ml-4">
            {rightContent}
          </div>
        )}
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="glass-morphism">
            <div className="flex flex-col space-y-6 pt-6">
              <MobileNavLink href="/#home">Home</MobileNavLink>
              <MobileNavLink href="/#planner">Plan Trip</MobileNavLink>
              <Link to="/chat" className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </Link>
              <MobileNavLink href="/#gallery">Destinations</MobileNavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
  >
    {children}
  </a>
);

export default Header;
