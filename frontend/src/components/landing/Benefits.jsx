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
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Platform Features</h2>
          <p className="text-muted-foreground text-lg">
            Experience a streamlined healthcare journey designed for both patients and medical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none bg-muted/50 hover:bg-muted transition-colors group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
                <CardDescription className="text-base">{benefit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
