// src/components/Resume/ImportResume.jsx
import { useState } from 'react';
import { FaUpload, FaFilePdf, FaFileWord, FaMagic, FaTimes } from 'react-icons/fa';

const ImportResume = ({ darkMode, onImport, onClose }) => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      // Check file size (max 5MB)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum size is 5MB.');
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain'];
      if (!validTypes.includes(uploadedFile.type)) {
        alert('Please upload PDF, Word (.doc/.docx), or text files only.');
        return;
      }
      
      setFile(uploadedFile);
      parseResumeFile(uploadedFile);
    }
  };

  const parseResumeFile = async () => {
    setParsing(true);
    setProgress(0);
    
    // Simulate parsing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      
      // Sample parsed data structure
      const sampleParsedData = {
        personalInfo: {
          name: "John Doe",
          title: "Senior Software Engineer",
          email: "john.doe@example.com",
          phone: "+1 (234) 567-8900",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/johndoe",
          github: "github.com/johndoe"
        },
        summary: "Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable web applications and leading development teams.",
        experience: [
          {
            id: Date.now(),
            title: "Senior Software Engineer",
            company: "Tech Corp Inc.",
            location: "San Francisco, CA",
            startDate: "2020-01",
            endDate: "",
            current: true,
            description: "• Led a team of 5 developers in building scalable microservices architecture\n• Improved application performance by 40%\n• Implemented CI/CD pipelines reducing deployment time by 60%"
          },
          {
            id: Date.now() + 1,
            title: "Full Stack Developer",
            company: "Startup XYZ",
            location: "New York, NY",
            startDate: "2018-06",
            endDate: "2019-12",
            current: false,
            description: "• Developed and maintained multiple web applications using React, Node.js, and MongoDB\n• Integrated third-party APIs and payment systems\n• Reduced page load time by 30% through optimization"
          }
        ],
        education: [
          {
            id: Date.now() + 2,
            degree: "Bachelor of Science in Computer Science",
            university: "Stanford University",
            location: "Stanford, CA",
            graduationDate: "2018-05",
            gpa: "3.8",
            achievements: "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development"
          }
        ],
        skills: [
          { id: Date.now() + 3, name: "JavaScript", level: 5, category: "Technical" },
          { id: Date.now() + 4, name: "React", level: 5, category: "Frontend" },
          { id: Date.now() + 5, name: "Node.js", level: 4, category: "Backend" },
          { id: Date.now() + 6, name: "Python", level: 4, category: "Technical" },
          { id: Date.now() + 7, name: "AWS", level: 3, category: "Cloud" }
        ],
        projects: [
          {
            id: Date.now() + 8,
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce platform with real-time inventory management",
            technologies: "React, Node.js, MongoDB, Stripe",
            link: "https://github.com/johndoe/ecommerce",
            startDate: "2021-03",
            endDate: "2021-08"
          }
        ],
        certifications: [
          {
            id: Date.now() + 9,
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2022-06",
            credentialId: "AWS123456",
            link: "https://aws.amazon.com/certification"
          }
        ],
        languages: [
          {
            id: Date.now() + 10,
            language: "English",
            proficiency: "Native",
            level: "C2"
          },
          {
            id: Date.now() + 11,
            language: "Spanish",
            proficiency: "Intermediate",
            level: "B1"
          }
        ]
      };
      
      setTimeout(() => {
        onImport(sampleParsedData);
        setParsing(false);
        setProgress(0);
      }, 500);
      
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      clearInterval(interval);
      setParsing(false);
      setProgress(0);
      alert('Error parsing file. Please try again or enter information manually.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <FaUpload className="mr-2" />
            Import Existing Resume
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center ${darkMode 
            ? 'border-gray-700 hover:border-blue-500 bg-gray-900/50' 
            : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-6">
            <div className="flex justify-center space-x-6 mb-4">
              <div className="text-center">
                <FaFilePdf className="text-4xl text-red-500 mx-auto mb-2" />
                <span className="text-sm">PDF Files</span>
              </div>
              <div className="text-center">
                <FaFileWord className="text-4xl text-blue-500 mx-auto mb-2" />
                <span className="text-sm">Word Docs</span>
              </div>
            </div>
            
            <p className="mb-4">Drag & drop your resume file here, or click to browse</p>
            <p className="text-sm opacity-70 mb-6">Supports: .pdf, .doc, .docx, .txt (Max 5MB)</p>
            
            <label className={`px-6 py-3 rounded-lg font-bold inline-flex items-center space-x-2 cursor-pointer transition-colors ${darkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <FaUpload />
              <span>Choose File</span>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.txt" 
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          
          {parsing && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-4">
                <FaMagic className="animate-pulse text-purple-500 text-2xl" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">AI is parsing your resume...</p>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 opacity-70">
                    Extracting information from: {file?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {file && !parsing && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <p className="font-medium flex items-center">
                <span className="mr-2">✓</span> {file.name}
              </p>
              <p className="text-sm opacity-70">Ready to import</p>
            </div>
          )}
        </div>
        
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h4 className="font-bold mb-2">How it works:</h4>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
              <span>Upload your PDF or Word resume</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
              <span>Our AI extracts text and information automatically</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
              <span>Review and edit extracted information</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
              <span>Apply to any template instantly</span>
            </li>
          </ol>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
        <h4 className="font-bold mb-2">💡 Pro Tip</h4>
        <p className="text-sm">
          For best results, make sure your resume has clear sections (Experience, Education, Skills) 
          and uses standard formatting. The AI works best with well-structured documents.
        </p>
      </div>
    </div>
  );
};

export default ImportResume;