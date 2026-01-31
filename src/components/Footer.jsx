// src/components/Footer.jsx
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`py-10 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-black text-white'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <IoDocumentTextOutline className="text-2xl text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">ResumePro</h2>
              <p className="text-sm text-gray-400">Build resumes that get noticed</p>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="#" className="hover:text-blue-400 transition text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-400 transition text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400 transition text-xl">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-gray-300 transition text-xl">
              <FaGithub />
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <div className={`my-6 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-800'}`}></div>
        
        {/* Footer Text */}
        <div className="text-center">
          <p className="text-gray-400">
            © 2026 ResumePro Builder. All rights reserved.
          </p>
          
          <p className="text-xs mt-2 text-gray-600">
            Create professional, ATS-friendly resumes in minutes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;