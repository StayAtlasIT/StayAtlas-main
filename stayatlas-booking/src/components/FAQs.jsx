import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "How do I book a villa through StayAtlas?",
      answer:
        "Booking with StayAtlas is simple! Search for your desired destination and dates, browse our curated selection of villas, and book instantly with our secure platform. You'll receive immediate confirmation and detailed property information.",
    },
    {
      question: "What is included in the villa rental?",
      answer:
        "Our villa rentals typically include fully furnished accommodations, linens, basic amenities, and often features like pools, kitchens, and outdoor spaces. Specific inclusions vary by property and are clearly listed in each villa's description.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify your booking according to the specific cancellation policy of each property. Most of our villas offer flexible cancellation options. You can manage your booking through your StayAtlas account or contact our support team.",
    },
    {
      question: "Are the properties verified and safe?",
      answer:
        "Absolutely! Every villa on StayAtlas is personally inspected and verified by our team. We ensure all properties meet our high standards for safety, cleanliness, and quality. We also provide 24/7 support throughout your stay.",
    },
    {
      question: "What happens if there's an issue during my stay?",
      answer:
        "Our 24/7 concierge team is always available to assist you. Whether it's a maintenance issue, questions about local attractions, or any other concern, we're just a phone call away and committed to resolving any issues quickly.",
    },
    {
      question: "Do you offer additional services like cleaning or catering?",
      answer:
        "Yes! Many of our villas offer additional services such as daily housekeeping, private chefs, spa treatments, and local experience coordination. These services can be arranged before or during your stay through our concierge team.",
    },
    {
      question: "How do I check in to my villa?",
      answer:
        "Check-in details are provided 24-48 hours before your arrival via email and SMS. This includes property manager contact information, access codes or key pickup instructions, and a detailed property guide with WiFi passwords and house rules.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods. Payment is processed securely through our platform, and you'll receive detailed receipts for your records. Some properties may require a security deposit.",
    },
  ];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className="py-20  transition-shadow duration-300 rounded-xl">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="font-serif text-3xl sm:text-4xl font-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-600">
            Find answers to common questions about booking and staying with StayAtlas
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {visibleFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/50 rounded-lg px-6 bg-card/30 bg-white backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6 text-lg bg-white font-semibold text-foreground px-4 rounded-lg ">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground leading-relaxed  px-4 py-3 rounded-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* See All / Show Less Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-primary border border-border px-5 py-2 rounded-full bg-white hover:bg-secondary transition-colors shadow-sm hover:shadow-md"
          >
            {showAll ? "Show Less FAQs" : "See All FAQs"}
          </button>
        </div>

        {/* Support Contact CTA */}
        {/* <div className="mt-12 text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl bg-white p-8 inline-block shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-lg text-muted-foreground mb-4">
              Still have questions? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@stayatlas.com"
                className="inline-flex items-center justify-center bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                📧 Email Support
              </a>
              <a
                href="tel:+918591131447"
                className="inline-flex items-center justify-center border border-border hover:bg-secondary text-foreground px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                📞 Call Us: +91 85911 31447
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQ;
