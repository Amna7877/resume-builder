// src/components/Resume/TemplateCard.jsx
import { FaStar, FaCrown, FaCheck, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TemplateCard = ({ template, darkMode, onPreviewClick }) => {
  return (
    <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${darkMode 
      ? 'bg-gray-800 border border-gray-700' 
      : 'bg-white border border-gray-200 shadow-lg'}`}
    >
      <div className="relative overflow-hidden h-64">
        {/* Placeholder image for actual resume template design */}
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 dark:text-blue-400 mb-2">{template.name.split(' ')[0]}</div>
            <div className="text-gray-600 dark:text-gray-400">Resume Template</div>
            <div className={`text-sm mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
              {template.popularity}% Success Rate
            </div>
          </div>
        </div>
        
        {/* Overlay for quick preview */}
        <button
          onClick={onPreviewClick}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <span className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg font-medium">
            <FaEye />
            <span>Quick Preview</span>
          </span>
        </button>
        
        {/* Badges */}
        <div className={`absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 rounded-full ${darkMode 
          ? 'bg-gray-900/80 text-yellow-400' 
          : 'bg-white/90 text-yellow-600'}`}
        >
          <FaStar className="text-sm" />
          <span className="text-sm font-bold">{template.popularity}%</span>
        </div>
        
        {!template.isFree && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-linear-to-r from-yellow-500 to-orange-500 text-white">
            <FaCrown className="text-sm" />
            <span className="text-sm font-bold">Premium</span>
          </div>
        )}
        
        {template.isFree && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-bold">
            FREE
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{template.name}</h3>
          <span className={`text-sm px-2 py-1 rounded ${darkMode 
            ? 'bg-gray-700 text-gray-300' 
            : 'bg-gray-100 text-gray-700'}`}
          >
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </span>
        </div>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {template.description}
        </p>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <FaCheck className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            <span className="text-sm">ATS Friendly</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCheck className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            <span className="text-sm">Fully Customizable</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onPreviewClick}
            className={`flex-1 py-2 text-center rounded-lg font-medium transition flex items-center justify-center space-x-2 ${darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer`}
          >
            <FaEye />
            <span>Preview</span>
          </button>
          
          <Link
            to={`/create-resume?template=${template.id}`}
            className={`flex-1 py-2 text-center rounded-lg font-bold transition flex items-center justify-center ${darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            Use Template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;