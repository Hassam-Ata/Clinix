const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register & Role",
      description: "Sign up as a Patient or Doctor. Our platform tailors the experience to your specific role.",
    },
    {
      number: "02",
      title: "Profile Completion",
      description: "Patients set up their health profiles. Doctors onboard with specialization and credentials for verification.",
    },
    {
      number: "03",
      title: "Smart Matching",
      description: "Patients browse verified doctors by fee and specialty. Doctors manage their schedule and approve requests.",
    },
    {
      number: "04",
      title: "Seamless Consultation",
      description: "Complete your appointment through secure video links and access post-consultation stats and summaries.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Clinix Journey</h2>
          <p className="text-muted-foreground text-lg">
            A structured workflow ensuring quality care for patients and professional management for doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 animate-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl font-black text-white/5 mb-4 group-hover:text-sky-500/20 transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {/* Connecting Line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-[1px] bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
