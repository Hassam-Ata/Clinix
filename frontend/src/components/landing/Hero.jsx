import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pb-20 md:pt-20 md:pb-28 overflow-hidden ">
      {/* Background elements - Subtle radial spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full opacity-50" />
      </div>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(14,165,233,0.1)] animate-slide-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          Modern Healthcare <br />
          <span className="text-sky-500 italic">Redefined</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
          Connect with top-tier specialized doctors, manage your medical
          appointments, and access a secure patient portal—all in one premium
          platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          <Link to="/register">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold bg-sky-500 hover:bg-sky-400 transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:ring-2 focus:ring-sky-500"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* ECG Background - Positioned lower */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 animate-heart-pulse">
            <div className="absolute bottom-10 left-0 w-[200%] h-32 animate-ecg-move text-sky-500/40">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 2000 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 50 L100 50 L110 40 L120 60 L130 20 L140 80 L150 50 L250 50 L260 40 C270 40 270 60 280 60 L300 60 L310 50 L400 50 L410 40 L420 60 L430 20 L440 80 L450 50 L550 50 L560 40 C570 40 570 60 580 60 L600 60 L610 50 L700 50 L710 40 L720 60 L730 20 L740 80 L750 50 L850 50 L860 40 C870 40 870 60 880 60 L900 60 L910 50 L1000 50 L1100 50 L1110 40 L1120 60 L1130 20 L1140 80 L1150 50 L1250 50 L1260 40 C1270 40 1270 60 1280 60 L1300 60 L1310 50 L1400 50 L1410 40 L1420 60 L1430 20 L1440 80 L1450 50 L1550 50 L1560 40 C1570 40 1570 60 1580 60 L1600 60 L1610 50 L1700 50 L1710 40 L1720 60 L1730 20 L1740 80 L1750 50 L1850 50 L1860 40 C1870 40 1870 60 1880 60 L1900 60 L1910 50 L2000 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
