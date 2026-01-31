// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft, FaGoogle, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { supabase } from '../utils/supabaseClient';

const Login = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ REAL SUPABASE LOGIN (For real users)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if it's demo credentials
    if (formData.email === 'demo@resumepro.com' && formData.password === 'demopassword') {
      // Use LOCAL login for demo (NO SUPABASE)
      const demoUser = {
        id: 'demo_user_123',
        email: 'demo@resumepro.com',
        name: 'Demo User',
        created_at: new Date().toISOString(),
        resumes: []
      };

      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(demoUser));
      localStorage.setItem('isDemo', 'true');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      setLoading(false);
      return;
    }

    // For other users, try Supabase
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Save login state
      localStorage.setItem('userLoggedIn', 'true');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOCIAL LOGIN
  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ DEMO LOGIN (QUICK TEST - LOCAL ONLY)
  const handleDemoLogin = () => {
    setLoading(true);
    setError('');
    
    // Auto-fill form for visual effect
    setFormData({
      email: 'demo@resumepro.com',
      password: 'demopassword'
    });
    
    // Create demo user data
    const demoUser = {
      id: 'demo_user_123456',
      email: 'demo@resumepro.com',
      name: 'Demo User',
      created_at: new Date().toISOString(),
      resumes: [
        {
          id: 'res_1',
          title: 'Software Engineer Resume',
          template: 'Modern Pro',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-30T14:20:00Z',
          download_count: 5,
          ats_score: 92
        },
        {
          id: 'res_2',
          title: 'Marketing Manager',
          template: 'Executive',
          status: 'draft',
          created_at: '2024-01-20T11:15:00Z',
          updated_at: '2024-01-25T09:45:00Z',
          download_count: 1,
          ats_score: 85
        }
      ]
    };

    // Save to localStorage (NO SUPABASE)
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(demoUser));
    localStorage.setItem('resumes', JSON.stringify(demoUser.resumes));
    localStorage.setItem('isDemo', 'true');
    
    // Show success and redirect
    setTimeout(() => {
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* Back & Theme Toggle */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 hover:text-blue-500 transition text-sm md:text-base">
          <FaArrowLeft /> <span>Back to Home</span>
        </Link>
        <button
          onClick={toggleDarkMode}
          className={`p-2 md:p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <IoDocumentTextOutline className="text-4xl md:text-5xl text-blue-500 mb-3 md:mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold">Welcome to ResumePro</h1>
          <p className={`mt-1 md:mt-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to manage your resumes
          </p>
        </div>

        {/* Demo Button */}
        <div className="mb-4 md:mb-6">
          <p className="text-center mb-2 text-sm md:text-base text-gray-500">Quick Test:</p>
          <button
            onClick={handleDemoLogin}
            className={`w-full py-2 md:py-3 rounded-xl text-sm md:text-base transition ${darkMode 
              ? 'bg-blue-900/30 hover:bg-blue-800/40 border border-blue-700/50' 
              : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}
          >
            Try Demo Account
          </button>
        </div>

        {/* Social Login */}
        <div className="mb-6 md:mb-8">
          <p className="text-center mb-3 md:mb-4 text-sm md:text-base text-gray-500">Or continue with</p>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className={`py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2 transition ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FcGoogle className="text-xl md:text-2xl" />
              <span className="text-sm md:text-base">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className={`py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2 transition ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaGithub className="text-xl md:text-2xl" />
              <span className="text-sm md:text-base">GitHub</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4 md:my-6">
          <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <span className={`px-3 md:px-4 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            or with email
          </span>
          <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleEmailLogin}>
          {/* Error Message */}
          {error && (
            <div className={`mb-3 md:mb-4 p-3 rounded-lg text-sm md:text-base ${darkMode 
              ? 'bg-red-900/30 text-red-200 border border-red-800/50' 
              : 'bg-red-50 text-red-700 border border-red-200'}`}
            >
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4 md:mb-6">
            <label className="block mb-2 font-medium text-sm md:text-base">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 md:p-4 rounded-xl border-2 transition text-sm md:text-base ${darkMode 
                ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 md:mb-6">
            <label className="block mb-2 font-medium text-sm md:text-base">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full p-3 md:p-4 rounded-xl border-2 transition pr-12 text-sm md:text-base ${darkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                  : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6 md:mb-8 text-sm md:text-base">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 md:w-5 md:h-5 rounded accent-blue-500" 
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Remember me
              </span>
            </label>
            <Link 
              to="/forgot-password" 
              className={`hover:text-blue-500 transition ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 
              hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
              ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 md:mt-8 text-sm md:text-base">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Don't have an account?{' '}
          </span>
          <Link 
            to="/signup" 
            className={`font-bold hover:text-blue-500 transition ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;