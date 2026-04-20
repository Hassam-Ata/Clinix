import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavLinks = () => {
    const path = location.pathname;
    
    if (path.startsWith("/patient")) {
      return [
        { name: "Dashboard", href: "/patient/dashboard" },
        { name: "Appointments", href: "/patient/appointments" },
        { name: "Medical Records", href: "/patient/records" },
        { name: "Profile", href: "/patient/profile" },
      ];
    }
    
    if (path.startsWith("/doctor")) {
      return [
        { name: "Dashboard", href: "/doctor/dashboard" },
        { name: "Patients", href: "/doctor/patients" },
        { name: "Schedule", href: "/doctor/schedule" },
        { name: "Profile", href: "/doctor/profile" },
      ];
    }

    if (path.startsWith("/admin")) {
      return [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Users", href: "/admin/users" },
        { name: "Clinics", href: "/admin/clinics" },
        { name: "Settings", href: "/admin/settings" },
      ];
    }

    // Default Landing Links
    return [
      { name: "Features", href: "/#features", isHash: true },
      { name: "How it Works", href: "/#how-it-works", isHash: true },
      { name: "FAQ", href: "/#faq", isHash: true },
    ];
  };

  const navLinks = getNavLinks();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isDashboard = ["/patient", "/doctor", "/admin"].some(role => location.pathname.startsWith(role));

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Clinix</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    location.pathname === link.href ? "text-primary" : ""
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {!isDashboard && !isAuthPage && (
            <div className="flex items-center gap-4 border-l pl-8">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {isDashboard && (
            <div className="flex items-center gap-4 border-l pl-8">
               <Button variant="outline" size="sm" onClick={() => {
                 localStorage.clear();
                 window.location.href = "/login";
               }}>
                 Logout
               </Button>
            </div>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Activity className="h-6 w-6 text-primary" />
                  Clinix
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                    link.isHash ? (
                        <a
                          key={link.name}
                          href={link.href}
                          className="text-lg font-medium hover:text-primary transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.href}
                          className={`text-lg font-medium hover:text-primary transition-colors ${
                            location.pathname === link.href ? "text-primary" : ""
                          }`}
                        >
                          {link.name}
                        </Link>
                      )
                ))}
                
                <hr className="my-2" />
                
                {!isDashboard && !isAuthPage && (
                    <>
                        <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link to="/register" className="w-full">
                            <Button className="w-full">Get Started</Button>
                        </Link>
                    </>
                )}

                {isDashboard && (
                     <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

