// src/pages/Templates.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TemplateCard from '../components/Resume/TemplateCard';
import { FaFilter, FaSearch, FaArrowLeft } from 'react-icons/fa';

const Templates = ({ darkMode, toggleDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const templateCategories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'ats', name: 'ATS Friendly' },
  ];

  const templates = [
    {
      id: '1',
      name: 'Modern Pro',
      category: 'modern',
      description: 'Clean, professional design with emphasis on skills',
      preview: '/templates/modern-pro.png', // Changed to local image path
      popularity: 95,
      isFree: true,
    },
    {
      id: '2',
      name: 'Executive',
      category: 'professional',
      description: 'Traditional format for corporate roles',
      preview: '/templates/executive.png', // Changed to local image path
      popularity: 88,
      isFree: true,
    },
    {
      id: '3',
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'For designers, artists, and creative professionals',
      preview: '/templates/creative-portfolio.png', // Changed to local image path
      popularity: 92,
      isFree: false,
    },
    {
      id: '4',
      name: 'Minimalist',
      category: 'minimal',
      description: 'Simple and elegant design',
      preview: '/templates/minimalist.png', // Changed to local image path
      popularity: 85,
      isFree: true,
    },
    {
      id: '5',
      name: 'ATS Optimized',
      category: 'ats',
      description: 'Designed to pass through applicant tracking systems',
      preview: '/templates/ats-optimized.png', // Changed to local image path
      popularity: 98,
      isFree: true,
    },
    {
      id: '6',
      name: 'Tech Resume',
      category: 'modern',
      description: 'Perfect for software engineers and tech roles',
      preview: '/templates/tech-resume.png', // Changed to local image path
      popularity: 90,
      isFree: false,
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreviewClick = (templateId) => {
    navigate(`/templates/${templateId}`);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="container mx-auto px-4 md:px-6 py-6">
        <Link 
          to="/" 
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Resume Template</h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select from professionally designed templates. All templates are ATS-friendly and customizable.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${darkMode 
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white' 
                : 'bg-white border-gray-300 focus:border-blue-500 text-black'}`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            <div className="flex flex-wrap gap-2">
              {templateCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                    ? darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map(template => (
              <TemplateCard 
                key={template.id}
                template={template}
                darkMode={darkMode}
                onPreviewClick={() => handlePreviewClick(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No templates found</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        <div className={`mt-16 p-8 rounded-2xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Resume?</h2>
          <p className={`mb-6 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a template and start customizing your professional resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-resume"
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Start Blank Resume
            </Link>
            <Link
              to="/create-resume"
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              Create Resume Now
            </Link>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Templates;