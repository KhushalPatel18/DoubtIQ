import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is DoubtIQ?",
    answer:
      "DoubtIQ is an AI-powered academic assistant that helps students resolve doubts by providing clear, step-by-step explanations in simple language.",
  },
  {
    question: "How does DoubtIQ solve doubts?",
    answer:
      "Students submit their questions, and DoubtIQ uses artificial intelligence to analyze the query and generate structured explanations for better understanding.",
  },
  {
    question: "Is DoubtIQ free to use?",
    answer:
      "Yes, DoubtIQ is currently free for educational use. Advanced features may be introduced in the future.",
  },
  {
    question: "Can I use DoubtIQ for any subject?",
    answer:
      "DoubtIQ supports a wide range of academic subjects, including mathematics, science, and programming-related topics.",
  },
  {
    question: "Is my data safe on DoubtIQ?",
    answer:
      "Yes, user data is handled securely, and doubts are processed only to generate responses and improve learning experience.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-950 py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Frequently Asked <span className="text-purple-500">Questions</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Everything you need to know about DoubtIQ.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-800 rounded-xl bg-gray-900/60"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 px-5 pb-5" : "max-h-0 px-5"
                  }`}
                >
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
