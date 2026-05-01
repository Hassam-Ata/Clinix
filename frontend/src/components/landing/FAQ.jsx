import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I register as a doctor?",
      answer: "Choose the 'Doctor' role during registration. You will then be prompted to provide your specialization, consultation fees, and professional credentials for admin verification.",
    },
    {
      question: "What happens after I submit my doctor application?",
      answer: "Our admin team reviews your credentials. Once approved, you will receive an automated email with a secure link to access your specialized Doctor Portal.",
    },
    {
      question: "How can patients find the right doctor?",
      answer: "The Patient Portal provides a comprehensive list of all verified doctors. You can sort and filter them by specialization, consultation fees, and availability.",
    },
    {
      question: "Is the video consultation secure?",
      answer: "Yes, every accepted appointment generates a unique, secure meeting link. All platform interactions are encrypted to protect patient and provider privacy.",
    },
    {
      question: "Is the video consultation secure and good?",
      answer: "Yes, every accepted appointment generates a unique, secure meeting link. All platform interactions are encrypted to protect patient and provider privacy.",
    },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Essential information for patients and healthcare providers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-slide-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="border border-white/5 bg-white/[0.02] rounded-xl px-4 transition-all duration-200 hover:bg-white/[0.05] hover:border-white/10 group"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6 transition-all duration-200 group-data-[state=open]:text-sky-400 [&[data-state=open]>svg]:text-sky-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
