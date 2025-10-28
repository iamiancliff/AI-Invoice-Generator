import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "../../utils/data";

const NumberBadge = ({ index }) => (
  <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-white/80 text-sm font-semibold">
    {(index + 1).toString().padStart(2, '0')}
  </div>
);

const FaqItem = ({ faq, isOpen, onClick, index }) => (
  <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 border ${isOpen ? 'border-white/20 bg-white/[0.05]' : 'border-white/10 bg-white/[0.03]'} hover:border-white/20`}>
    <button 
      onClick={onClick} 
      className="w-full flex items-start gap-4 p-6 cursor-pointer text-left"
    >
      <NumberBadge index={index} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-white font-semibold text-lg font-whyte">{faq.question}</h3>
          <div className={`rounded-lg border border-white/10 p-2 bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-white/80" />
          </div>
        </div>
        {isOpen && (
          <div className="mt-4 text-[var(--text-secondary)] leading-relaxed">
            {faq.answer}
          </div>
        )}
      </div>
    </button>
    {/* subtle connector on the left for visual rhythm */}
    <div className="absolute left-[1.5rem] top-0 bottom-0 w-px bg-white/5" />
  </div>
);

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section id="faq" className="py-24 lg:py-32 bg-base relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-whyte font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-medium">
            Everything you need to know about our AI-powered invoicing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 bg-white/10 border border-white/10">
              <HelpCircle className="w-7 h-7 text-white/90" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-whyte">Still have questions?</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto font-medium">Our support team is here to help you get the most out of our platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="mailto:support@aiinvoiceapp.com" className="btn-primary px-7 py-3 rounded-xl font-medium">Contact Support</a>
              <a href="#features" className="btn-secondary px-7 py-3 rounded-xl font-medium">Explore Features</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
