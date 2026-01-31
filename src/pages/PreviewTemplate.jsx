// src/pages/PreviewTemplate.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaArrowLeft, FaCheck, FaCrown, FaStar, FaMobileAlt, FaDesktop, FaTabletAlt, FaPalette, FaDownload, FaShare, FaHeart, FaCopy, FaEdit } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';

const PreviewTemplate = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('desktop');
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const templates = [
    {
      id: '1',
      name: 'Modern Pro',
      category: 'modern',
      description: 'Clean, professional design with emphasis on skills and experience. Perfect for tech professionals.',
      preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=1000&fit=crop',
      popularity: 95,
      isFree: true,
      features: [
        'ATS Optimized',
        'Responsive Design',
        'Custom Color Schemes',
        'Multiple Layouts',
        'Export as PDF',
        'Mobile Friendly'
      ],
      compatibleWith: ['Software Engineer', 'Project Manager', 'Marketing', 'Finance', 'Data Analyst'],
      colors: ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#ea580c'],
      downloads: '10K+',
      rating: 4.8,
      layout: 'two-column',
      tags: ['Modern', 'Professional', 'Tech']
    },
    {
      id: '2',
      name: 'Executive',
      category: 'professional',
      description: 'Traditional format for corporate roles with emphasis on leadership and achievements.',
      preview: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&h=1000&fit=crop',
      popularity: 88,
      isFree: true,
      features: [
        'Professional Layout',
        'Leadership Focus',
        'Achievement Oriented',
        'Corporate Style',
        'PDF Export',
        'Clean Typography'
      ],
      compatibleWith: ['Executive', 'Manager', 'Director', 'Consultant', 'Business Analyst'],
      colors: ['#1e40af', '#374151', '#0f766e', '#7c3aed', '#0d9488'],
      downloads: '8.5K+',
      rating: 4.6,
      layout: 'single-column',
      tags: ['Corporate', 'Professional', 'Traditional']
    },
    {
      id: '3',
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'For designers, artists, and creative professionals who want to showcase their work.',
      preview: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=1000&fit=crop',
      popularity: 92,
      isFree: false,
      features: [
        'Portfolio Integration',
        'Creative Layouts',
        'Image Galleries',
        'Custom Typography',
        'Project Showcase',
        'Visual Focus'
      ],
      compatibleWith: ['Designer', 'Artist', 'Photographer', 'Writer', 'Content Creator'],
      colors: ['#db2777', '#ea580c', '#16a34a', '#9333ea', '#0891b2'],
      downloads: '7.2K+',
      rating: 4.7,
      layout: 'creative',
      tags: ['Creative', 'Portfolio', 'Design']
    },
    {
      id: '4',
      name: 'Minimalist',
      category: 'minimal',
      description: 'Simple and elegant design that focuses on content without distractions.',
      preview: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=800&h=1000&fit=crop',
      popularity: 85,
      isFree: true,
      features: [
        'Clean Design',
        'Focus on Content',
        'Easy to Read',
        'Fast Loading',
        'Minimalist Style',
        'White Space'
      ],
      compatibleWith: ['Any Profession', 'Recent Graduates', 'Career Changers', 'Freelancers'],
      colors: ['#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
      downloads: '9.1K+',
      rating: 4.5,
      layout: 'minimal',
      tags: ['Minimal', 'Clean', 'Simple']
    },
    {
      id: '5',
      name: 'ATS Optimized',
      category: 'ats',
      description: 'Designed specifically to pass through applicant tracking systems used by most companies.',
      preview: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=1000&fit=crop',
      popularity: 98,
      isFree: true,
      features: [
        'ATS Friendly',
        'Keyword Optimized',
        'Standard Formatting',
        'Parse Friendly',
        'HR Approved',
        'Industry Standard'
      ],
      compatibleWith: ['All Industries', 'Large Companies', 'Corporate Jobs', 'Government'],
      colors: ['#059669', '#2563eb', '#4f46e5', '#0d9488', '#7c3aed'],
      downloads: '12.5K+',
      rating: 4.9,
      layout: 'ats',
      tags: ['ATS', 'Corporate', 'Standard']
    },
    {
      id: '6',
      name: 'Tech Resume',
      category: 'modern',
      description: 'Specifically designed for software engineers and technology professionals.',
      preview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=1000&fit=crop',
      popularity: 90,
      isFree: false,
      features: [
        'Tech Focused',
        'Skills Highlight',
        'GitHub Integration',
        'Projects Section',
        'Code Formatting',
        'Technical Skills'
      ],
      compatibleWith: ['Software Engineer', 'Data Scientist', 'DevOps', 'UX Designer', 'Product Manager'],
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
      downloads: '6.8K+',
      rating: 4.7,
      layout: 'tech',
      tags: ['Tech', 'Developer', 'Software']
    },
  ];

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const foundTemplate = templates.find(t => t.id === id);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setSelectedColor(foundTemplate.colors[0]);
      } else {
        navigate('/templates');
      }
      setLoading(false);
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleUseTemplate = () => {
    navigate(`/create-resume?template=${template.id}`);
  };

  const handleDownload = () => {
    // Create a dummy PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${template.name}-Sample-Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Downloading ${template.name} sample PDF...`);
  };

  const handleShare = () => {
    const shareData = {
      title: template.name,
      text: `Check out this resume template: ${template.description}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy link to clipboard');
        });
    }
  };

  const renderResumePreview = () => {
    if (!template) return null;

    const resumeContent = {
      name: "John Doe",
      title: "Senior Software Engineer",
      email: "john.doe@example.com",
      phone: "+1 (123) 456-7890",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      summary: "Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable web applications and leading development teams.",
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Corp Inc.",
          duration: "2020 - Present",
          description: "Led a team of 5 developers in building scalable microservices architecture. Improved application performance by 40%."
        },
        {
          title: "Full Stack Developer",
          company: "Startup XYZ",
          duration: "2018 - 2020",
          description: "Developed and maintained multiple web applications using React, Node.js, and MongoDB."
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          university: "Stanford University",
          duration: "2016 - 2020",
          description: "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development"
        }
      ],
      skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "MongoDB", "Git"],
      languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Intermediate" }
      ],
      certifications: ["AWS Certified Developer", "Google Professional Cloud Architect"]
    };

    return (
      <div className={`rounded-lg overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="p-6" style={{ backgroundColor: selectedColor + '20' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{resumeContent.name}</h2>
              <p className="opacity-80">{resumeContent.title}</p>
              <p className="text-sm mt-1">{resumeContent.location}</p>
            </div>
            <div className="text-right">
              <p>{resumeContent.email}</p>
              <p>{resumeContent.phone}</p>
              <div className="flex justify-end space-x-2 mt-1">
                <span className="text-sm opacity-70">LinkedIn: {resumeContent.linkedin}</span>
                <span className="text-sm opacity-70">GitHub: {resumeContent.github}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {template.layout === 'two-column' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Professional Summary
                  </h3>
                  <p className="text-sm">{resumeContent.summary}</p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {resumeContent.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold">{exp.title}</h4>
                          <span className="text-sm opacity-70">{exp.duration}</span>
                        </div>
                        <p className="text-sm opacity-80 mb-1">{exp.company}</p>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Education
                  </h3>
                  {resumeContent.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{edu.degree}</h4>
                        <span className="text-sm opacity-70">{edu.duration}</span>
                      </div>
                      <p className="text-sm opacity-80 mb-1">{edu.university}</p>
                      <p className="text-sm">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeContent.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: selectedColor + '20',
                          color: selectedColor
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Languages
                  </h3>
                  {resumeContent.languages.map((lang, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{lang.name}</span>
                        <span className="text-sm opacity-70">{lang.level}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                    Certifications
                  </h3>
                  <ul className="space-y-1">
                    {resumeContent.certifications.map((cert, index) => (
                      <li key={index} className="text-sm">• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : template.layout === 'single-column' ? (
            // Single column layout
            <div className="space-y-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                Professional Experience
              </h3>
              {resumeContent.experience.map((exp, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: selectedColor }}>
                  <h4 className="font-bold">{exp.title}</h4>
                  <p className="text-sm opacity-80">{exp.company} • {exp.duration}</p>
                  <p className="mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            // Default layout
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: selectedColor }}>
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {resumeContent.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <IoDocumentTextOutline className="text-5xl text-blue-500 animate-pulse mx-auto mb-4" />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading template preview...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Template not found</h2>
          <Link 
            to="/templates" 
            className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Header Section */}
      <div className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Link 
                  to="/templates" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                >
                  <FaArrowLeft />
                  <span>Back to Templates</span>
                </Link>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{template.name}</h1>
              <p className={`max-w-3xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {template.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{template.popularity}%</div>
                  <div className="text-sm opacity-70">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{template.downloads}</div>
                  <div className="text-sm opacity-70">Downloads</div>
                </div>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart className={`text-lg ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
              </button>

              {template.isFree ? (
                <div className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold flex items-center">
                  FREE TEMPLATE
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 text-white font-bold">
                  <FaCrown />
                  <span>PREMIUM</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview Area */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              {/* Preview Controls */}
              <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Preview Mode:</span>
                    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setActiveView('mobile')}
                        className={`p-2 rounded transition-colors ${activeView === 'mobile' 
                          ? 'bg-white dark:bg-gray-600' 
                          : 'hover:bg-gray-300 dark:hover:bg-gray-800'}`}
                        title="Mobile view"
                      >
                        <FaMobileAlt />
                      </button>
                      <button
                        onClick={() => setActiveView('tablet')}
                        className={`p-2 rounded transition-colors ${activeView === 'tablet' 
                          ? 'bg-white dark:bg-gray-600' 
                          : 'hover:bg-gray-300 dark:hover:bg-gray-800'}`}
                        title="Tablet view"
                      >
                        <FaTabletAlt />
                      </button>
                      <button
                        onClick={() => setActiveView('desktop')}
                        className={`p-2 rounded transition-colors ${activeView === 'desktop' 
                          ? 'bg-white dark:bg-gray-600' 
                          : 'hover:bg-gray-300 dark:hover:bg-gray-800'}`}
                        title="Desktop view"
                      >
                        <FaDesktop />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className="w-8 h-8 rounded hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{zoom}%</span>
                      <button 
                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                        className="w-8 h-8 rounded hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="p-6">
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 min-h-150 flex items-center justify-center">
                  <div 
                    className="transition-all duration-300"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center',
                      width: activeView === 'mobile' ? '375px' : 
                             activeView === 'tablet' ? '768px' : 
                             '100%',
                      maxWidth: '900px',
                      height: activeView === 'mobile' ? '667px' : 
                             activeView === 'tablet' ? '1024px' : 
                             'auto'
                    }}
                  >
                    {renderResumePreview()}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="mt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FaPalette />
                    <span className="font-medium">Customize Color:</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {template.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedColor === color 
                          ? 'scale-110 border-white dark:border-gray-300 shadow-lg ring-2 ring-offset-2' 
                          : 'border-transparent hover:scale-105 hover:shadow-md'}`}
                        style={{ 
                          backgroundColor: color,
                          borderColor: selectedColor === color ? 'white' : 'transparent'
                        }}
                        title={color}
                        aria-label={`Select color ${color}`}
                      >
                        {selectedColor === color && (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaCheck className="text-xs text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm opacity-70">Selected: </span>
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                      <code className="text-sm font-mono">{selectedColor}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedColor);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This is a preview. Your actual resume will be fully customizable with your information.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaStar className="text-yellow-500 mr-2" />
                Template Features
              </h3>
              <ul className="space-y-3">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <FaCheck className="text-green-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perfect For */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4">Perfect For</h3>
              <div className="flex flex-wrap gap-2">
                {template.compatibleWith.map((role, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'}`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Template Stats */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4">Template Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-blue-500">{template.popularity}%</div>
                  <div className="text-sm opacity-70">Success Rate</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-green-500">{template.downloads}</div>
                  <div className="text-sm opacity-70">Downloads</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-yellow-500">{template.rating}/5</div>
                  <div className="text-sm opacity-70">User Rating</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-purple-500">{template.isFree ? 'Free' : 'Premium'}</div>
                  <div className="text-sm opacity-70">Plan</div>
                </div>
              </div>
            </div>

            {/* Get Started */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4">Get Started</h3>
              
              <button
                onClick={handleUseTemplate}
                className={`w-full py-4 rounded-xl font-bold text-lg mb-4 transition-all duration-200 hover:scale-[1.02] ${darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-black hover:bg-gray-800 text-white'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaEdit />
                  <span>{template.isFree ? 'Use This Template' : 'Get Premium Template'}</span>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={handleDownload}
                  className={`py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <FaDownload />
                  <span>Sample PDF</span>
                </button>
                <button 
                  onClick={handleShare}
                  className={`py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-lg ${index < Math.floor(template.rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm opacity-70">({template.rating}/5)</span>
                </div>
              </div>

              <p className={`text-sm text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {template.isFree ? 
                  "This template is completely free to use with all features." : 
                  "Premium template includes advanced features and priority support."
                }
              </p>
            </div>

            {/* Tags */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4">Template Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${darkMode 
                      ? 'bg-blue-900/30 text-blue-300' 
                      : 'bg-blue-100 text-blue-700'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 p-8 rounded-2xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Resume?</h2>
          <p className={`mb-6 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Customize this template with your own information and download in PDF format.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/templates"
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Browse More Templates
            </Link>
            <button
              onClick={handleUseTemplate}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              Start Creating Now
            </button>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default PreviewTemplate;