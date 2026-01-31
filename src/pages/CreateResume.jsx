// src/pages/CreateResume.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaSave, FaDownload, FaEye, FaUndo, FaRedo, 
  FaPalette, FaFont, FaCopy, FaShareAlt,
  FaChevronLeft, FaChevronRight,
  FaPlus, FaTrash,
  FaUser, FaFileAlt, FaBriefcase, FaGraduationCap,
  FaCode, FaProjectDiagram, FaCertificate, FaGlobe,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub,
  FaCalendar, FaUniversity, FaStar, FaLanguage,
  FaCheck, FaSpinner, FaCloudDownloadAlt
} from 'react-icons/fa';
import { MdWork, MdSchool, MdBuild } from 'react-icons/md';

const CreateResume = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get('template') || '1';
  const resumeId = queryParams.get('resumeId');
  
  const resumePreviewRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Initial resume data structure
  const getInitialResumeData = () => ({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
    
    if (resumeId && savedResumes.length > 0) {
      const savedResume = savedResumes.find(r => r.id === resumeId);
      if (savedResume) {
        setResumeData(savedResume.data);
        setCustomization(savedResume.customization || getInitialCustomization());
        // Initialize history
        const initialHistory = [JSON.stringify(savedResume.data)];
        setHistory(initialHistory);
        setHistoryIndex(0);
        return;
      }
    }
    
    // Initialize with empty data
    const initialData = getInitialResumeData();
    const initialHistory = [JSON.stringify(initialData)];
    setResumeData(initialData);
    setHistory(initialHistory);
    setHistoryIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  // Initial state
  const [resumeData, setResumeData] = useState(getInitialResumeData());
  const [activeSection, setActiveSection] = useState('personal');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Get initial customization based on template
  const getInitialCustomization = () => {
    const templates = {
      '1': { fontFamily: 'Inter', primaryColor: '#2563eb', layout: 'modern' },
      '2': { fontFamily: 'Times New Roman', primaryColor: '#1e40af', layout: 'traditional' },
      '3': { fontFamily: 'Montserrat', primaryColor: '#db2777', layout: 'creative' },
      '4': { fontFamily: 'Helvetica', primaryColor: '#4b5563', layout: 'minimal' },
      '5': { fontFamily: 'Arial', primaryColor: '#059669', layout: 'ats' }
    };
    
    const template = templates[templateId] || templates['1'];
    return {
      fontFamily: template.fontFamily,
      fontSize: '14px',
      primaryColor: template.primaryColor,
      secondaryColor: '#6b7280',
      spacing: 'normal',
      layout: template.layout
    };
  };

  const [customization, setCustomization] = useState(getInitialCustomization());

  // Templates configuration
  const templates = {
    '1': { name: 'Modern Pro', layout: 'modern', colors: ['#2563eb', '#059669', '#7c3aed'] },
    '2': { name: 'Executive', layout: 'traditional', colors: ['#1e40af', '#374151'] },
    '3': { name: 'Creative', layout: 'creative', colors: ['#db2777', '#ea580c'] },
    '4': { name: 'Minimalist', layout: 'minimal', colors: ['#4b5563', '#6b7280'] },
    '5': { name: 'ATS Optimized', layout: 'ats', colors: ['#059669', '#2563eb'] }
  };

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let totalFields = 0;
    let filledFields = 0;

    // Personal Info (3 required fields)
    const requiredPersonalFields = ['name', 'title', 'email'];
    totalFields += requiredPersonalFields.length;
    requiredPersonalFields.forEach(field => {
      if (resumeData.personalInfo[field]?.trim()) filledFields++;
    });

    // Experience (at least 1 experience with title and company)
    if (resumeData.experience.length > 0) {
      totalFields += 2; // title and company for first experience
      const firstExp = resumeData.experience[0];
      if (firstExp.title?.trim()) filledFields++;
      if (firstExp.company?.trim()) filledFields++;
    }

    // Education (at least 1 education with degree and university)
    if (resumeData.education.length > 0) {
      totalFields += 2; // degree and university for first education
      const firstEdu = resumeData.education[0];
      if (firstEdu.degree?.trim()) filledFields++;
      if (firstEdu.university?.trim()) filledFields++;
    }

    // Skills
    totalFields += 1;
    if (resumeData.skills.length > 0) filledFields++;

    // Summary
    totalFields += 1;
    if (resumeData.summary?.trim()) filledFields++;

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }, [resumeData]);

  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    setCompletionPercentage(calculateCompletion());
  }, [resumeData, calculateCompletion]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (historyIndex >= 0 && history.length > 0) {
        const currentData = JSON.parse(history[historyIndex]);
        saveResumeToLocalStorage(currentData, false);
      }
    };

    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, history]);

  // Save to history
  const saveToHistory = useCallback((data) => {
    const newHistory = [...history.slice(0, historyIndex + 1), JSON.stringify(data)];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle input changes with auto-save
  const handleInputChange = useCallback((section, field, value) => {
    setResumeData(prev => {
      const updatedData = { ...prev };
      
      if (section.includes('.')) {
        const [mainSection, subSection] = section.split('.');
        updatedData[mainSection] = { ...updatedData[mainSection], [subSection]: value };
      } else {
        updatedData[section] = value;
      }
      
      saveToHistory(updatedData);
      return updatedData;
    });
  }, [saveToHistory]);

  // Handle array field changes
  const handleArrayFieldChange = useCallback((section, index, field, value) => {
    setResumeData(prev => {
      const updatedData = { ...prev };
      updatedData[section] = [...updatedData[section]];
      updatedData[section][index] = { ...updatedData[section][index], [field]: value };
      saveToHistory(updatedData);
      return updatedData;
    });
  }, [saveToHistory]);

  // Add new item to array
  const addNewItem = useCallback((section) => {
    setResumeData(prev => {
      const updatedData = { ...prev };
      
      const getNewItem = () => {
        switch(section) {
          case 'experience':
            return {
              id: Date.now(),
              title: '',
              company: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            };
          case 'education':
            return {
              id: Date.now(),
              degree: '',
              university: '',
              location: '',
              graduationDate: '',
              gpa: '',
              achievements: ''
            };
          case 'skills':
            return {
              id: Date.now(),
              name: '',
              level: 5,
              category: 'Technical'
            };
          case 'projects':
            return {
              id: Date.now(),
              name: '',
              description: '',
              technologies: '',
              link: '',
              startDate: '',
              endDate: ''
            };
          case 'certifications':
            return {
              id: Date.now(),
              name: '',
              issuer: '',
              date: '',
              credentialId: '',
              link: ''
            };
          case 'languages':
            return {
              id: Date.now(),
              language: '',
              proficiency: 'Intermediate',
              level: 'B2'
            };
          default:
            return { id: Date.now() };
        }
      };
      
      updatedData[section] = [...updatedData[section], getNewItem()];
      saveToHistory(updatedData);
      return updatedData;
    });
  }, [saveToHistory]);

  // Remove item from array
  const removeItem = useCallback((section, index) => {
    setResumeData(prev => {
      const updatedData = { ...prev };
      updatedData[section] = updatedData[section].filter((_, i) => i !== index);
      saveToHistory(updatedData);
      return updatedData;
    });
  }, [saveToHistory]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setResumeData(JSON.parse(history[newIndex]));
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setResumeData(JSON.parse(history[newIndex]));
    }
  }, [history, historyIndex]);

  // Save resume to localStorage
  const saveResumeToLocalStorage = (data, showAlert = true) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      const resumeIdToUse = resumeId || Date.now().toString();
      
      const resumeToSave = {
        id: resumeIdToUse,
        title: data.personalInfo.title || 'Untitled Resume',
        data: data,
        customization: customization,
        template: templateId,
        createdAt: resumeId ? 
          (savedResumes.find(r => r.id === resumeId)?.createdAt || new Date().toISOString()) 
          : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const existingIndex = savedResumes.findIndex(r => r.id === resumeIdToUse);
      if (existingIndex >= 0) {
        savedResumes[existingIndex] = resumeToSave;
      } else {
        savedResumes.push(resumeToSave);
      }
      
      localStorage.setItem('userResumes', JSON.stringify(savedResumes));
      setLastSaved(new Date().toLocaleTimeString());
      
      if (showAlert) {
        alert('Resume saved successfully!');
      }
      return resumeIdToUse;
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  // Save button handler
  const handleSave = async () => {
    setSaving(true);
    
    // Validate required fields
    if (!resumeData.personalInfo.name.trim()) {
      alert('Please enter your name');
      setSaving(false);
      return;
    }
    
    if (!resumeData.personalInfo.email.trim()) {
      alert('Please enter your email');
      setSaving(false);
      return;
    }
    
    const savedId = saveResumeToLocalStorage(resumeData, true);
    setSaving(false);
    
    if (savedId && !resumeId) {
      // Update URL with resume ID for editing
      navigate(`/create-resume?resumeId=${savedId}&template=${templateId}`, { replace: true });
    }
  };

  // REAL PDF DOWNLOAD FUNCTION
  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) {
      alert('Cannot generate PDF. Please try again.');
      return;
    }
    
    setIsGeneratingPDF(true);
    
    try {
      // Save resume first
      saveResumeToLocalStorage(resumeData, false);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add more pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename
      const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save PDF
      pdf.save(fileName);
      
      alert(`PDF downloaded successfully: ${fileName}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      const resumeText = `
RESUME
${'='.repeat(50)}

${resumeData.personalInfo.name}
${resumeData.personalInfo.title}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}
${resumeData.personalInfo.location}

${resumeData.summary ? `SUMMARY:\n${resumeData.summary}\n` : ''}

${resumeData.experience.length > 0 ? 'EXPERIENCE:\n' + resumeData.experience.map(exp => 
  `• ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n  ${exp.description}`
).join('\n\n') + '\n' : ''}

${resumeData.education.length > 0 ? 'EDUCATION:\n' + resumeData.education.map(edu => 
  `• ${edu.degree} - ${edu.university} (${edu.graduationDate})${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`
).join('\n') + '\n' : ''}

${resumeData.skills.length > 0 ? 'SKILLS:\n' + resumeData.skills.map(skill => skill.name).join(', ') + '\n' : ''}

${resumeData.personalInfo.linkedin ? `LinkedIn: ${resumeData.personalInfo.linkedin}\n` : ''}
${resumeData.personalInfo.github ? `GitHub: ${resumeData.personalInfo.github}\n` : ''}
      `.trim();
      
      await navigator.clipboard.writeText(resumeText);
      alert('Resume copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  // Section configuration with icons
  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <FaUser />, description: 'Name, contact info' },
    { id: 'summary', label: 'Professional Summary', icon: <FaFileAlt />, description: 'Career objective' },
    { id: 'experience', label: 'Work Experience', icon: <MdWork />, description: 'Work history' },
    { id: 'education', label: 'Education', icon: <MdSchool />, description: 'Academic background' },
    { id: 'skills', label: 'Skills', icon: <MdBuild />, description: 'Technical & soft skills' },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram />, description: 'Notable projects' },
    { id: 'certifications', label: 'Certifications', icon: <FaCertificate />, description: 'Certificates earned' },
    { id: 'languages', label: 'Languages', icon: <FaGlobe />, description: 'Language proficiency' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Editor Header */}
      <div className={`sticky top-0 z-40 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/templates"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaChevronLeft />
                <span>Back to Templates</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  {resumeId ? 'Edit Resume' : 'Create Resume'}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Template: <span className="font-medium">{templates[templateId]?.name}</span>
                  {lastSaved && ` • Last saved: ${lastSaved}`}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 disabled:opacity-30' 
                    : 'hover:bg-gray-200 disabled:opacity-30'
                }`}
                title="Undo"
              >
                <FaUndo />
              </button>
              
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 disabled:opacity-30' 
                    : 'hover:bg-gray-200 disabled:opacity-30'
                }`}
                title="Redo"
              >
                <FaRedo />
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <FaEye />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50' 
                    : 'bg-black hover:bg-gray-800 disabled:opacity-50 text-white'
                }`}
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{saving ? 'Saving...' : 'Save Resume'}</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 disabled:opacity-50' 
                    : 'bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white'
                }`}
              >
                {isGeneratingPDF ? <FaSpinner className="animate-spin" /> : <FaCloudDownloadAlt />}
                <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Sections */}
          <div className="lg:col-span-3">
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-bold text-lg">Sections</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Click to edit each section
                </p>
              </div>
              
              <div className="p-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                      activeSection === section.id
                        ? darkMode 
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : darkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-lg ${
                      activeSection === section.id
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {section.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{section.label}</div>
                      <div className={`text-xs ${
                        activeSection === section.id
                          ? darkMode ? 'text-blue-300' : 'text-blue-600'
                          : darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {section.description}
                      </div>
                    </div>
                    {activeSection === section.id && (
                      <FaChevronRight className="ml-auto text-sm opacity-60" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className={`mt-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'} p-4`}>
              <h3 className="font-bold text-lg mb-4">Resume Progress</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Completion</span>
                  <span className="font-bold">{completionPercentage}%</span>
                </div>
                <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Personal Info</span>
                  <FaCheck className={`text-green-500 ${!resumeData.personalInfo.name && 'opacity-30'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Experience</span>
                  <FaCheck className={`text-green-500 ${resumeData.experience.length === 0 && 'opacity-30'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Education</span>
                  <FaCheck className={`text-green-500 ${resumeData.education.length === 0 && 'opacity-30'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Skills</span>
                  <FaCheck className={`text-green-500 ${resumeData.skills.length === 0 && 'opacity-30'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-5">
            <div className={`rounded-xl h-full ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {sections.find(s => s.id === activeSection)?.icon}
                  <h3 className="font-bold text-lg">
                    {sections.find(s => s.id === activeSection)?.label}
                  </h3>
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fill in your details. Changes are auto-saved.
                </p>
              </div>
              
              <div className="p-4">
                {/* Personal Info Form */}
                {activeSection === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium flex items-center">
                          <FaUser className="mr-2" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.name}
                          onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Professional Title *</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.title}
                          onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="Software Engineer"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium flex items-center">
                          <FaEnvelope className="mr-2" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium flex items-center">
                          <FaPhone className="mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="+1 (234) 567-8900"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium flex items-center">
                          <FaLinkedin className="mr-2" />
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium flex items-center">
                          <FaGithub className="mr-2" />
                          GitHub/Portfolio
                        </label>
                        <input
                          type="url"
                          value={resumeData.personalInfo.github}
                          onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-colors ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="github.com/username"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Form */}
                {activeSection === 'summary' && (
                  <div>
                    <label className="block mb-2 text-sm font-medium flex items-center">
                      <FaFileAlt className="mr-2" />
                      Professional Summary
                    </label>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Write a brief overview of your professional background and career objectives (2-3 sentences recommended)
                    </p>
                    <textarea
                      value={resumeData.summary}
                      onChange={(e) => handleInputChange('summary', '', e.target.value)}
                      className={`w-full h-48 p-3 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                          : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable applications..."
                    />
                    <div className="mt-3 text-sm text-gray-500">
                      {resumeData.summary.length} characters • {resumeData.summary.split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>
                )}

                {/* Experience Form */}
                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    {resumeData.experience.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <MdWork className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Experience Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add your work experience to showcase your professional journey
                        </p>
                      </div>
                    ) : (
                      resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <MdWork />
                              <h4 className="font-bold">Experience #{index + 1}</h4>
                            </div>
                            <button
                              onClick={() => removeItem('experience', index)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                              }`}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Job Title *</label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'title', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Senior Software Engineer"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium">Company *</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Tech Corp Inc."
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium flex items-center">
                                <FaCalendar className="mr-2" />
                                Start Date
                              </label>
                              <input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium">End Date</label>
                              <div className="flex space-x-2">
                                <input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)}
                                  className={`w-full p-2 rounded-lg border transition-colors ${
                                    darkMode 
                                      ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                  }`}
                                  disabled={exp.current}
                                />
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => handleArrayFieldChange('experience', index, 'current', e.target.checked)}
                                    className="rounded"
                                  />
                                  <span className="text-sm">Current</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium">Description</label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                              className={`w-full h-32 p-2 rounded-lg border transition-colors ${
                                darkMode 
                                  ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              }`}
                              placeholder="• Led team of 5 developers...
• Improved application performance by 40%..."
                            />
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Use bullet points (•) or dashes (-) for achievements
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button
                      onClick={() => addNewItem('experience')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Experience</span>
                    </button>
                  </div>
                )}

                {/* Education Form */}
                {activeSection === 'education' && (
                  <div className="space-y-6">
                    {resumeData.education.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <MdSchool className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Education Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add your educational background
                        </p>
                      </div>
                    ) : (
                      resumeData.education.map((edu, index) => (
                        <div key={edu.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <MdSchool />
                              <h4 className="font-bold">Education #{index + 1}</h4>
                            </div>
                            <button
                              onClick={() => removeItem('education', index)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                              }`}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Degree *</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium flex items-center">
                                <FaUniversity className="mr-2" />
                                University *
                              </label>
                              <input
                                type="text"
                                value={edu.university}
                                onChange={(e) => handleArrayFieldChange('education', index, 'university', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Stanford University"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Graduation Date</label>
                              <input
                                type="month"
                                value={edu.graduationDate}
                                onChange={(e) => handleArrayFieldChange('education', index, 'graduationDate', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium">GPA</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="3.8/4.0"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium flex items-center">
                              <FaStar className="mr-2" />
                              Achievements
                            </label>
                            <textarea
                              value={edu.achievements}
                              onChange={(e) => handleArrayFieldChange('education', index, 'achievements', e.target.value)}
                              className={`w-full h-24 p-2 rounded-lg border transition-colors ${
                                darkMode 
                                  ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              }`}
                              placeholder="Graduated with honors...
Relevant coursework: Data Structures, Algorithms..."
                            />
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button
                      onClick={() => addNewItem('education')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Education</span>
                    </button>
                  </div>
                )}

                {/* Skills Form */}
                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    {resumeData.skills.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <MdBuild className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Skills Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add your technical and soft skills
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resumeData.skills.map((skill, index) => (
                          <div key={skill.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                                className={`w-full p-2 rounded border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="React, JavaScript, etc."
                              />
                              <button
                                onClick={() => removeItem('skills', index)}
                                className={`ml-2 p-2 rounded transition-colors ${
                                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                                }`}
                                title="Remove"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="mt-2">
                              <label className="block mb-1 text-sm">Proficiency</label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map(level => (
                                  <button
                                    key={level}
                                    onClick={() => handleArrayFieldChange('skills', index, 'level', level)}
                                    className={`w-8 h-2 rounded transition-colors ${
                                      level <= skill.level
                                        ? darkMode ? 'bg-blue-500' : 'bg-blue-400'
                                        : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                                    }`}
                                    title={`Level ${level}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button
                      onClick={() => addNewItem('skills')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Skill</span>
                    </button>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'}`}>
                      <h4 className="font-bold mb-2">Skill Suggestions</h4>
                      <div className="flex flex-wrap gap-2">
                        {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Git', 'TypeScript', 'MongoDB', 'SQL'].map(skill => (
                          <button
                            key={skill}
                            onClick={() => {
                              const newSkill = { 
                                id: Date.now(), 
                                name: skill, 
                                level: 5,
                                category: 'Technical'
                              };
                              setResumeData(prev => ({
                                ...prev,
                                skills: [...prev.skills, newSkill]
                              }));
                              saveToHistory({...resumeData, skills: [...resumeData.skills, newSkill]});
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Form */}
                {activeSection === 'projects' && (
                  <div className="space-y-6">
                    {resumeData.projects.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <FaProjectDiagram className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Projects Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add your notable projects
                        </p>
                      </div>
                    ) : (
                      resumeData.projects.map((project, index) => (
                        <div key={project.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <FaProjectDiagram />
                              <h4 className="font-bold">Project #{index + 1}</h4>
                            </div>
                            <button
                              onClick={() => removeItem('projects', index)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                              }`}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Project Name</label>
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="E-commerce Website"
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 text-sm font-medium">Description</label>
                              <textarea
                                value={project.description}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                                className={`w-full h-32 p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Built a full-stack e-commerce platform..."
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 text-sm font-medium">Technologies Used</label>
                              <input
                                type="text"
                                value={project.technologies}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="React, Node.js, MongoDB"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button
                      onClick={() => addNewItem('projects')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Project</span>
                    </button>
                  </div>
                )}

                {/* Certifications Form */}
                {activeSection === 'certifications' && (
                  <div className="space-y-6">
                    {resumeData.certifications.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <FaCertificate className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Certifications Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add your professional certifications
                        </p>
                      </div>
                    ) : (
                      resumeData.certifications.map((cert, index) => (
                        <div key={cert.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <FaCertificate />
                              <h4 className="font-bold">Certification #{index + 1}</h4>
                            </div>
                            <button
                              onClick={() => removeItem('certifications', index)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                              }`}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => handleArrayFieldChange('certifications', index, 'name', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block mb-2 text-sm font-medium">Issuing Organization</label>
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => handleArrayFieldChange('certifications', index, 'issuer', e.target.value)}
                                  className={`w-full p-2 rounded-lg border transition-colors ${
                                    darkMode 
                                      ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                  }`}
                                  placeholder="Amazon Web Services"
                                />
                              </div>
                              
                              <div>
                                <label className="block mb-2 text-sm font-medium">Date Earned</label>
                                <input
                                  type="month"
                                  value={cert.date}
                                  onChange={(e) => handleArrayFieldChange('certifications', index, 'date', e.target.value)}
                                  className={`w-full p-2 rounded-lg border transition-colors ${
                                    darkMode 
                                      ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button
                      onClick={() => addNewItem('certifications')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Certification</span>
                    </button>
                  </div>
                )}

                {/* Languages Form */}
                {activeSection === 'languages' && (
                  <div className="space-y-6">
                    {resumeData.languages.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <FaGlobe className="text-4xl mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">No Languages Added</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Add languages you speak
                        </p>
                      </div>
                    ) : (
                      resumeData.languages.map((lang, index) => (
                        <div key={lang.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <FaGlobe />
                              <h4 className="font-bold">Language #{index + 1}</h4>
                            </div>
                            <button
                              onClick={() => removeItem('languages', index)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                              }`}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium">Language</label>
                              <input
                                type="text"
                                value={lang.language}
                                onChange={(e) => handleArrayFieldChange('languages', index, 'language', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="English"
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 text-sm font-medium">Proficiency</label>
                              <select
                                value={lang.proficiency}
                                onChange={(e) => handleArrayFieldChange('languages', index, 'proficiency', e.target.value)}
                                className={`w-full p-2 rounded-lg border transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                              >
                                <option value="Beginner">Beginner (A1-A2)</option>
                                <option value="Intermediate">Intermediate (B1-B2)</option>
                                <option value="Advanced">Advanced (C1)</option>
                                <option value="Fluent">Fluent/Native (C2)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button
                      onClick={() => addNewItem('languages')}
                      className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaPlus />
                      <span>Add Language</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="lg:col-span-4">
            <div className={`rounded-xl sticky top-24 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center">
                    <FaEye className="mr-2" />
                    Live Preview
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title="Copy to clipboard"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time preview of your resume
                </p>
              </div>
              
              <div className="p-4">
                <div className="relative">
                  {/* Resume Preview Container - This will be used for PDF generation */}
                  <div 
                    ref={resumePreviewRef}
                    className={`resume-preview-container rounded-lg border-2 ${
                      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                    } overflow-hidden`}
                    style={{ 
                      fontFamily: customization.fontFamily,
                      fontSize: '12px',
                      lineHeight: '1.4'
                    }}
                  >
                    <div className="p-6">
                      {/* Resume Header */}
                      <div className="border-b pb-4 mb-4" style={{ borderColor: customization.primaryColor + '40' }}>
                        <h1 
                          className="text-2xl font-bold mb-2"
                          style={{ color: customization.primaryColor }}
                        >
                          {resumeData.personalInfo.name || 'Your Name'}
                        </h1>
                        <p className="text-lg opacity-80 mb-3">
                          {resumeData.personalInfo.title || 'Professional Title'}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {resumeData.personalInfo.email && (
                            <span className="opacity-70">{resumeData.personalInfo.email}</span>
                          )}
                          {resumeData.personalInfo.phone && (
                            <span className="opacity-70">• {resumeData.personalInfo.phone}</span>
                          )}
                          {resumeData.personalInfo.location && (
                            <span className="opacity-70">• {resumeData.personalInfo.location}</span>
                          )}
                        </div>
                        {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
                          <div className="flex flex-wrap gap-3 mt-2 text-sm">
                            {resumeData.personalInfo.linkedin && (
                              <span className="opacity-70">LinkedIn: {resumeData.personalInfo.linkedin}</span>
                            )}
                            {resumeData.personalInfo.github && (
                              <span className="opacity-70">GitHub: {resumeData.personalInfo.github}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Summary */}
                      {resumeData.summary && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-2" style={{ color: customization.primaryColor }}>
                            Professional Summary
                          </h2>
                          <p className="text-sm">{resumeData.summary}</p>
                        </div>
                      )}
                      
                      {/* Experience */}
                      {resumeData.experience.length > 0 && resumeData.experience[0].title && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Experience
                          </h2>
                          {resumeData.experience.map((exp, idx) => (
                            exp.title && (
                              <div key={idx} className="mb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold">{exp.title}</h3>
                                    <p className="text-sm opacity-80">{exp.company} {exp.location && `• ${exp.location}`}</p>
                                  </div>
                                  <div className="text-sm opacity-70 text-right">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                  </div>
                                </div>
                                {exp.description && (
                                  <p className="text-sm mt-1 opacity-90 whitespace-pre-line">{exp.description}</p>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {/* Education */}
                      {resumeData.education.length > 0 && resumeData.education[0].degree && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Education
                          </h2>
                          {resumeData.education.map((edu, idx) => (
                            edu.degree && (
                              <div key={idx} className="mb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold">{edu.degree}</h3>
                                    <p className="text-sm opacity-80">{edu.university} {edu.location && `• ${edu.location}`}</p>
                                  </div>
                                  <div className="text-sm opacity-70 text-right">
                                    {edu.graduationDate}
                                  </div>
                                </div>
                                {edu.gpa && (
                                  <p className="text-sm mt-1 opacity-90">GPA: {edu.gpa}</p>
                                )}
                                {edu.achievements && (
                                  <p className="text-sm mt-1 opacity-90">{edu.achievements}</p>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {/* Skills */}
                      {resumeData.skills.length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Skills
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 rounded-full text-sm"
                                style={{ 
                                  backgroundColor: customization.primaryColor + '20',
                                  color: customization.primaryColor
                                }}
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Projects */}
                      {resumeData.projects.length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Projects
                          </h2>
                          {resumeData.projects.map((project, idx) => (
                            project.name && (
                              <div key={idx} className="mb-3">
                                <h3 className="font-bold">{project.name}</h3>
                                {project.description && (
                                  <p className="text-sm mt-1 opacity-90">{project.description}</p>
                                )}
                                {project.technologies && (
                                  <p className="text-xs mt-1 opacity-70">Technologies: {project.technologies}</p>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {/* Certifications */}
                      {resumeData.certifications.length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Certifications
                          </h2>
                          {resumeData.certifications.map((cert, idx) => (
                            cert.name && (
                              <div key={idx} className="mb-2">
                                <p className="font-bold">{cert.name}</p>
                                <p className="text-sm opacity-80">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {/* Languages */}
                      {resumeData.languages.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold mb-3" style={{ color: customization.primaryColor }}>
                            Languages
                          </h2>
                          <div className="flex flex-wrap gap-3">
                            {resumeData.languages.map((lang, idx) => (
                              <span key={idx} className="text-sm">
                                {lang.language} ({lang.proficiency})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview Actions */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors ${
                        darkMode 
                          ? 'bg-green-600 hover:bg-green-700 disabled:opacity-50' 
                          : 'bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white'
                      }`}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <FaCloudDownloadAlt />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`px-4 py-3 rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Resume Completion</span>
                    <span className="font-bold">{completionPercentage}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm opacity-70">
                    {completionPercentage < 30 && 'Start by filling your personal information'}
                    {completionPercentage >= 30 && completionPercentage < 60 && 'Add experience and education to improve your resume'}
                    {completionPercentage >= 60 && completionPercentage < 90 && 'Good progress! Add skills and projects'}
                    {completionPercentage >= 90 && 'Excellent! Your resume is almost complete'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold">Resume Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-2xl hover:text-red-500"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[80vh]">
              <div 
                className="bg-white p-8 shadow-lg"
                style={{ fontFamily: customization.fontFamily }}
              >
                {/* Same preview content as above */}
                <div className="border-b pb-4 mb-4" style={{ borderColor: customization.primaryColor + '40' }}>
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ color: customization.primaryColor }}
                  >
                    {resumeData.personalInfo.name || 'Your Name'}
                  </h1>
                  <p className="text-xl opacity-80 mb-3">
                    {resumeData.personalInfo.title || 'Professional Title'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-base">
                    {resumeData.personalInfo.email && (
                      <span className="opacity-70">{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span className="opacity-70">• {resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span className="opacity-70">• {resumeData.personalInfo.location}</span>
                    )}
                  </div>
                </div>
                
                {/* Render all sections similar to above */}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 disabled:opacity-50"
              >
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default CreateResume;