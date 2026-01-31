// src/components/Hero.jsx
import { FaArrowRight, FaFileDownload, FaEdit, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = ({ darkMode }) => {
  return (
    <section className={`py-20 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Create Your <span className="text-blue-500">Professional Resume</span> in Minutes
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Build, customize, and download ATS-friendly resumes with our modern templates. Perfect for job seekers, students, and professionals.
        </p>
        <Link
          to="/signup"
          className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          <span>Start Building Now</span>
          <FaArrowRight className="animate-pulse" />
        </Link>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className={`p-6 rounded-2xl shadow-lg transition hover:shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-blue-500 mb-4">
              <FaEdit className="text-3xl mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Easy Editing</h3>
            <p>Fill in your details with our intuitive form. Real-time preview as you type.</p>
          </div>
          <div className={`p-6 rounded-2xl shadow-lg transition hover:shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-green-500 mb-4">
              <FaPalette className="text-3xl mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Multiple Templates</h3>
            <p>Choose from professional templates designed for different industries.</p>
          </div>
          <div className={`p-6 rounded-2xl shadow-lg transition hover:shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-purple-500 mb-4">
              <FaFileDownload className="text-3xl mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Instant Download</h3>
            <p>Download as PDF with one click. ATS-optimized and ready to send.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;