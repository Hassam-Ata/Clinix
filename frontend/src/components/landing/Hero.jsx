import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 animate-fade-in">
          Premium Healthcare Platform
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text">
          Modern Healthcare <br />
          <span className="text-primary italic">Redefined</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
          Connect with top-tier specialized doctors, manage your medical appointments, and access a secure patient portal—all in one premium platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
            <Play className="h-4 w-4 fill-current" /> Watch Demo
          </Button>
        </div>

        {/* Visual/Video Placeholder */}
        {/* <div className="relative max-w-5xl mx-auto rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="aspect-video bg-muted flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
               <Play className="h-10 w-10 text-primary" />
            </div>
            <img 
              src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=2070" 
              alt="Dashboard Preview" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
