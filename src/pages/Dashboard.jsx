import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImportResume from '../components/Resume/ImportResume'; 
import {
  FaPlus, FaFilePdf, FaEdit, FaTrash, FaDownload, FaUserCircle,
  FaClock, FaFileAlt, FaUpload, FaCog, FaEye, FaHistory
} from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [hasStarted, setHasStarted] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // ✅ Import modal state

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('userLoggedIn');
      const isDemo = localStorage.getItem('isDemo');

      if (isLoggedIn === 'true') {
        if (isDemo === 'true') {
          const demoUser = { 
            name: 'Demo User', 
            email: 'demo@resumepro.com',
            id: 'demo-user-123'
          };
          setUser(demoUser);
          loadDemoResumes();
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setUser(session.user);
            fetchUserResumes(session.user.id);
          } else {
            navigate('/login');
          }
        }
      } else {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Demo resumes for demo user
  const loadDemoResumes = () => {
    const demoResumes = JSON.parse(localStorage.getItem('demoResumes') || '[]');
    setResumes(demoResumes);
    setHasStarted(demoResumes.length > 0);
    setLoading(false);
  };

  const fetchUserResumes = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
      setHasStarted(data?.length > 0);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      // Fallback to localStorage for demo
      const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      setResumes(localResumes.filter(r => r.userId === userId));
      setHasStarted(localResumes.length > 0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setHasStarted(true);
    navigate('/templates');
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      const isDemo = localStorage.getItem('isDemo');
      
      if (isDemo === 'true') {
        // Delete from demo storage
        const demoResumes = JSON.parse(localStorage.getItem('demoResumes') || '[]');
        const updatedResumes = demoResumes.filter(r => r.id !== id);
        localStorage.setItem('demoResumes', JSON.stringify(updatedResumes));
        setResumes(updatedResumes);
      } else {
        // Delete from Supabase
        try {
          const { error } = await supabase.from('resumes').delete().eq('id', id);
          if (error) throw error;
          
          // Also delete from localStorage backup
          const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
          const updatedLocal = localResumes.filter(r => r.id !== id);
          localStorage.setItem('userResumes', JSON.stringify(updatedLocal));
          
          if (user) fetchUserResumes(user.id);
        } catch (error) {
          console.error('Error deleting resume:', error);
        }
      }
      alert('Resume deleted successfully!');
    }
  };

  const handleDownloadResume = (resume) => {
    // Create a temporary link for download
    const link = document.createElement('a');
    
    // For now, we'll create a simple text file
    // In real implementation, this would generate PDF
    const resumeText = `
${resume.title || 'Untitled Resume'}
${'='.repeat(50)}

${resume.data?.personalInfo?.name || 'Your Name'}
${resume.data?.personalInfo?.title || 'Professional Title'}
${resume.data?.personalInfo?.email || ''}
${resume.data?.personalInfo?.phone || ''}
${resume.data?.personalInfo?.location || ''}

Created: ${new Date(resume.createdAt || Date.now()).toLocaleDateString()}
Last Updated: ${new Date(resume.updatedAt || Date.now()).toLocaleDateString()}

To edit this resume, open it in the Resume Builder.
    `.trim();
    
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `${resume.title || 'Resume'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update download count
    const updatedResumes = resumes.map(r => 
      r.id === resume.id 
        ? { ...r, download_count: (r.download_count || 0) + 1 }
        : r
    );
    
    setResumes(updatedResumes);
    
    // Save updated count
    const isDemo = localStorage.getItem('isDemo');
    if (isDemo === 'true') {
      localStorage.setItem('demoResumes', JSON.stringify(updatedResumes));
    }
  };

  const handleImportResume = (importedData) => {
    // Create new resume from imported data
    const newResume = {
      id: `imported-${Date.now()}`,
      title: `${importedData.personalInfo?.name || 'Imported'} Resume`,
      data: importedData,
      customization: {
        fontFamily: 'Inter',
        primaryColor: '#2563eb',
        layout: 'modern'
      },
      template: '1',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      download_count: 0,
      user_id: user?.id || 'demo'
    };

    const updatedResumes = [newResume, ...resumes];
    setResumes(updatedResumes);
    setHasStarted(true);
    
    // Save based on user type
    const isDemo = localStorage.getItem('isDemo');
    if (isDemo === 'true') {
      localStorage.setItem('demoResumes', JSON.stringify(updatedResumes));
    } else {
      // Save to Supabase and localStorage
      localStorage.setItem('userResumes', JSON.stringify([
        ...JSON.parse(localStorage.getItem('userResumes') || '[]'),
        newResume
      ]));
      
      // Optionally save to Supabase
      if (user && supabase) {
        supabase.from('resumes').insert([{
          ...newResume,
          user_id: user.id
        }]);
      }
    }
    
    setShowImportModal(false);
    alert('Resume imported successfully! Redirecting to editor...');
    
    // Redirect to edit the imported resume
    setTimeout(() => {
      navigate(`/create-resume?resumeId=${newResume.id}&template=1`);
    }, 1000);
  };

  const handleEditResume = (resumeId) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
      navigate(`/create-resume?resumeId=${resumeId}&template=${resume.template || '1'}`);
    }
  };

  // Stats calculation
  const stats = {
    total: resumes.length,
    completed: resumes.filter(r => r.status === 'completed').length,
    drafts: resumes.filter(r => r.status === 'draft' || !r.status).length,
    downloads: resumes.reduce((sum, r) => sum + (r.download_count || 0), 0)
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-black'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-all`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Header */}
      <div className={`border-b py-8 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-6xl text-blue-500" />
            <div>
              <h2 className="text-3xl font-bold">{user?.name || user?.email?.split('@')[0] || 'User'}</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {user?.email || 'No email available'}
              </p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  {resumes.length} Resumes
                </span>
                <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  {user?.id?.includes('demo') ? 'Demo Account' : 'Registered User'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} px-5 py-2 rounded-lg flex items-center gap-2 transition-colors`}
            >
              <FaUpload /> Import Resume
            </button>
            <button
              onClick={() => navigate('/templates')}
              className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} px-5 py-2 rounded-lg flex items-center gap-2 transition-colors`}
            >
              <FaEye /> Browse Templates
            </button>
            <button
              onClick={handleCreateNew}
              className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              <FaPlus /> New Resume
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              name: 'Total Resumes', 
              count: stats.total, 
              color: 'blue', 
              icon: <FaFileAlt />,
              description: 'All created resumes'
            },
            { 
              name: 'Completed', 
              count: stats.completed, 
              color: 'green', 
              icon: <FaFilePdf />,
              description: 'Ready to use'
            },
            { 
              name: 'Drafts', 
              count: stats.drafts, 
              color: 'yellow', 
              icon: <FaHistory />,
              description: 'In progress'
            },
            { 
              name: 'Downloads', 
              count: stats.downloads, 
              color: 'purple', 
              icon: <FaDownload />,
              description: 'Total downloads'
            }
          ].map(({ name, count, color, icon, description }, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{name}</p>
                  <h3 className="text-3xl font-bold">{count}</h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${darkMode ? `bg-${color}-500/20` : `bg-${color}-100`} text-${color}-500 text-2xl`}>
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Import Resume Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-2xl rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Import Resume</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  ×
                </button>
              </div>
              <ImportResume 
                darkMode={darkMode} 
                onImport={handleImportResume}
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowImportModal(false)}
                  className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumes List */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">My Resumes</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowImportModal(true)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <FaUpload className="inline mr-2" /> Import
              </button>
              <button
                onClick={handleCreateNew}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800 text-white'}`}
              >
                <FaPlus className="inline mr-2" /> New Resume
              </button>
            </div>
          </div>
          
          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-5xl mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
                Start by creating a new resume, importing an existing one, or choose from our professional templates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCreateNew}
                  className={`px-6 py-3 rounded-lg font-bold ${darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Create New Resume
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className={`px-6 py-3 rounded-lg font-bold ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Import Existing
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className={`${darkMode ? 'bg-gray-900 hover:bg-gray-850' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'} rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{resume.title || 'Untitled Resume'}</h4>
                      <div className="flex flex-wrap gap-2 text-sm mb-3">
                        <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          {resume.template || 'Default'}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${resume.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                          {resume.status === 'completed' ? 'Ready' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                      title="Delete"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm opacity-70 line-clamp-2">
                      {resume.data?.personalInfo?.name || 'No name'} • 
                      {resume.data?.personalInfo?.title || 'No title'}
                    </p>
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      Updated: {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEditResume(resume.id)}
                      className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg flex justify-center items-center gap-1 text-sm`}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDownloadResume(resume)}
                      className={`${darkMode ? 'bg-blue-900/30 hover:bg-blue-800/40' : 'bg-blue-100 hover:bg-blue-200'} py-2 rounded-lg flex justify-center items-center gap-1 text-sm`}
                    >
                      <FaDownload /> Export
                    </button>
                    <button
                      onClick={() => navigate(`/templates/${resume.template || '1'}`)}
                      className={`${darkMode ? 'bg-purple-900/30 hover:bg-purple-800/40' : 'bg-purple-100 hover:bg-purple-200'} py-2 rounded-lg flex justify-center items-center gap-1 text-sm`}
                    >
                      <FaEye /> Preview
                    </button>
                  </div>
                  
                  <div className="flex justify-between text-xs mt-4 text-gray-500 dark:text-gray-400">
                    <span><FaDownload className="inline mr-1" /> {resume.download_count || 0}</span>
                    <span><FaClock className="inline mr-1" /> {resume.data?.experience?.length || 0} experiences</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`mt-8 rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/templates')}
              className={`p-4 rounded-xl text-left ${darkMode ? 'bg-gray-900 hover:bg-gray-850' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
            >
              <FaEye className="text-2xl mb-2 text-blue-500" />
              <h4 className="font-bold">Browse Templates</h4>
              <p className="text-sm opacity-70">Choose from 50+ professional designs</p>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className={`p-4 rounded-xl text-left ${darkMode ? 'bg-gray-900 hover:bg-gray-850' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
            >
              <FaUpload className="text-2xl mb-2 text-green-500" />
              <h4 className="font-bold">Import Resume</h4>
              <p className="text-sm opacity-70">Upload PDF/Word and auto-fill</p>
            </button>
            <button
              onClick={handleCreateNew}
              className={`p-4 rounded-xl text-left ${darkMode ? 'bg-blue-900/30 hover:bg-blue-800/40' : 'bg-blue-50 hover:bg-blue-100'} transition-colors`}
            >
              <FaPlus className="text-2xl mb-2 text-blue-600" />
              <h4 className="font-bold">Create New</h4>
              <p className="text-sm opacity-70">Start from scratch with our builder</p>
            </button>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Dashboard;