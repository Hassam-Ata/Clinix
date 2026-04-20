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
  ];

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Essential information for patients and healthcare providers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-primary/10">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
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
