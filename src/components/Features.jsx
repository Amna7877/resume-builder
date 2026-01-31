// src/components/Features.jsx
import { FaShieldAlt, FaMobileAlt, FaCloudDownloadAlt, FaSearch } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';

const Features = ({ darkMode }) => {
  const features = [
    {
      icon: <IoDocumentText className="text-4xl text-blue-500" />,
      title: "Professional Templates",
      desc: "Choose from ATS-friendly templates designed by HR professionals for different industries."
    },
    {
      icon: <FaCloudDownloadAlt className="text-4xl text-green-500" />,
      title: "PDF Export",
      desc: "Download your resume as a high-quality PDF with proper formatting and margins."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
      title: "Secure Storage",
      desc: "Your resumes are stored securely in Supabase. Access them anytime, anywhere."
    },
    {
      icon: <FaMobileAlt className="text-4xl text-yellow-500" />,
      title: "Fully Responsive",
      desc: "Create and edit your resume on desktop, tablet, or mobile devices."
    }
  ];

  return (
    <section className={`py-20 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose ResumePro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
            >
              <div className="mb-6">{feat.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;