import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ClipboardList, Shield, Video, Zap, LayoutDashboard } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      title: "Patient Portal",
      description: "Manage your health profile, track spending, and view medical history in one place.",
      icon: User,
    },
    {
      title: "Verified Specialists",
      description: "Access a curated list of approved doctors. Filter by specialization and fees.",
      icon: ClipboardList,
    },
    {
      title: "Doctor Dashboard",
      description: "Doctors get tools to manage availability, track appointments, and view earnings.",
      icon: LayoutDashboard,
    },
    {
      title: "Telehealth Ready",
      description: "Connect via secure, high-quality video consultations with integrated meeting links.",
      icon: Video,
    },
    {
      title: "Real-time Booking",
      description: "Instant appointment booking with automated status updates for both roles.",
      icon: Zap,
    },
    {
      title: "Secure Records",
      description: "State-of-the-art encryption ensures all patient and doctor data remains private.",
      icon: Shield,
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Platform Features</h2>
          <p className="text-muted-foreground text-lg">
            Experience a streamlined healthcare journey designed for both patients and medical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-white/5 border border-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-200 ease-out group cursor-pointer overflow-hidden relative animate-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110 group-hover:text-sky-400">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-sky-400 transition-colors">{benefit.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground/70">{benefit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0">
                  Learn more &rarr;
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
