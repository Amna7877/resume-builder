// src/components/About.jsx
import { FaHeart, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';

const About = ({ darkMode }) => {
  return (
    <section className={`py-16 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            About ResumePro
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                ResumePro is a modern resume builder designed to help job seekers create professional, 
                ATS-friendly resumes in minutes. Our platform combines ease of use with powerful features 
                to give you an edge in the competitive job market.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className={`text-xl mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ATS Optimized</h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>All templates are designed to pass through Applicant Tracking Systems</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaUsers className={`text-xl mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User-Friendly</h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No design skills needed. Just fill in your information</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaClock className={`text-xl mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Creation</h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Create a complete resume in under 10 minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-8 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <ol className="space-y-4">
                {['Sign up for free', 'Choose a template', 'Fill in your details', 'Preview in real-time', 'Download as PDF'].map((step, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${darkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                      {index + 1}
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;