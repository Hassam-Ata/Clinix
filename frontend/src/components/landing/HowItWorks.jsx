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
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Clinix Journey</h2>
          <p className="text-muted-foreground text-lg">
            A structured workflow ensuring quality care for patients and professional management for doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-black text-primary/10 mb-4">{step.number}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
