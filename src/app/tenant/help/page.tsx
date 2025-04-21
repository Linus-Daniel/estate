// app/tenant/help/page.tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqs = [
  { question: "How do I pay rent?", answer: "Go to 'Pay Rent' in the sidebar." },
  { question: "How to submit a maintenance request?", answer: "Navigate to 'Maintenance' and click 'New Request'." },
];

export default function HelpPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Help Center</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">FAQs</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Your email" />
          <textarea placeholder="Describe your issue" />
          <Button className="bg-blue-600 hover:bg-blue-700">Submit</Button>
        </div>
      </div>
    </div>
  );
}