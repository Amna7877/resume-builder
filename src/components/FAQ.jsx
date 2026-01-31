// src/components/FAQ.jsx
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Is ResumePro really free?",
      a: "Yes! Basic features including template selection, editing, and PDF download are completely free. We offer premium templates for advanced users."
    },
    {
      q: "Are my resumes ATS-friendly?",
      a: "Absolutely! All our templates are designed to be parsed correctly by Applicant Tracking Systems used by most companies."
    },
    {
      q: "Can I edit my resume after saving?",
      a: "Yes, you can edit, update, or create multiple versions of your resume anytime. All changes are saved automatically."
    },
    {
      q: "What file formats can I download?",
      a: "You can download your resume as PDF (recommended for job applications) and also export as JSON for future editing."
    }
  ];

  return (
    <section className={`py-20 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left font-semibold text-xl"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span>{item.q}</span>
                {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openIndex === idx && (
                <div className={`px-6 pb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;